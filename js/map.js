

var map = L.map('map').setView([40.96155, 8.872], 11);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);
writeBts();

async function writeBts() {
    var bts_list = await fetch("https://eolo.zeromist.net/lista_bts.json",
        {
            mode: "cors", method: "GET", headers: {
                "Content-Type": "application/json",
            },
        }
    );
    bts_json = await bts_list.json();
    for (bts in bts_json) {

        var marker = L.marker([bts_json[bts]['lat'], bts_json[bts]['lng']], {
            name: bts_json[bts]['nome'],
            tecno: bts_json[bts]['tech_string'],
        }).addTo(map).on('click', onClick);
        var popup = marker.bindPopup(`${bts_json[bts]['nome']}`).addTo(map);

    }
}
async function getSectors(bts_name) {
    var sectors = await fetch(`https://eolo.zeromist.net/sectors/${bts_name}_sectors`,
        {
            mode: "cors", method: "GET", headers: {
                "Content-Type": "application/json",
            },
        }
    );
    if (sectors.status !== 200) {
        return 0;
    }
    sekt = await sectors.json();
    return sekt;
}
async function onClick(e) {
    var url_to_geotiff_file = "https://eolo.zeromist.net/images/badesi.tif";
    fetch(url_to_geotiff_file)
        .then(function (response) {
            return response.arrayBuffer();
        })
        .then(function (arrayBuffer) {
            parseGeoraster(arrayBuffer).then(function (georaster) {
                var scale = chroma.scale(["green","yellow","yellow","yellow", "red"]).domain([-20, 100]);
                var layer = new GeoRasterLayer({
                    
              opacity: 0.5,
                    georaster: georaster,
                    resolution: 512,
                    pixelValuesToColorFn: function (values) {
                        //console.log(values);
                      const value = values[0];
                      if (value < -5) return "rgb(0, 0, 0)";
                      if (values[3] == 0) {return "rgba(0,0,0,0)"};
                      return scale(value).hex();
                    }
                  });
                  layer.addTo(map);
                  map.fitBounds(layer.getBounds());
      
            })
        });

    

    sesso = await getSectors(this.options.name);

    console.log(sesso);
    tecnos_filtered = []
    if (sesso !== 0) {
        tecnos = getSectorCoverage(sesso);
        for (let i = 0; i < Object.keys(tecnos).length; i++) {
            if (!tecnos[i].includes("tecno 0")) {
                tecnos_filtered.push(tecnos[i]);
            }
        }
    } else {
        tecnos_filtered = ":C"
    }


    console.log(tecnos_filtered);
    console.log(this.options.name);
    document.getElementById('lat').innerHTML = `<p>${e.latlng['lat']}</p>`;
    document.getElementById('lng').innerHTML = `<p>${e.latlng['lng']}</p>`;
    document.getElementById('sec').innerHTML = `<p>${tecnos_filtered}</p>`;
    document.getElementById('tecno').innerHTML = `<p>${this.options.tecno}</p>`;
}

function getSectorCoverage(prova_sec) {
    var tecnos = []
    for (let i = 0; i < 3; i++) {
        try {
            console.log(Object.keys(prova_sec[i][i]).length);
        } catch (e) {
            console.log(`error ${i}`);
            continue
        }

        part_len = Object.keys(prova_sec[i][i]).length - 1;
        for (let j = 0; j < part_len; j++) {
            if (prova_sec[i][i][j][1] == 0) {
                prova_sec[i][i][j][1] = prova_sec[i][i][j + 1][0];
            }
            //console.log(prova_sec[i][i][j]);
        }
    }
    for (let i = 0; i < 3; i++) {
        console.log(`tecno ${i}`);
        s = 0
        try {
            console.log(Object.keys(prova_sec[i][i]).length);
        } catch (e) {
            console.log(`error ${i}`);
            continue
        }
        console.log(`tecno length ${Object.keys(prova_sec[i][i]).length}`);
        if (Object.keys(prova_sec[i][i]).length == 1) {
            console.log(`tecno ${i}: ${prova_sec[i][i][0][0]} - ${prova_sec[i][i][0][1]}`);
            tecnos.push(`tecno ${i}: ${Math.round((prova_sec[i][i][0][0] + Number.EPSILON) * 100) / 100} - ${Math.round((prova_sec[i][i][0][1] + Number.EPSILON) * 100) / 100}`);
            continue
        }

        for (let j = 1; j < Object.keys(prova_sec[i][i]).length; j++) {
            console.log(`piece ${j}`);
            start = prova_sec[i][i][s][0];
            if (j == Object.keys(prova_sec[i][i]).length - 1) {
                console.log('last');
                if (prova_sec[i][i][j][0] == prova_sec[i][i][j - 1][1]) {
                    end = prova_sec[i][i][j][1];
                    console.log(`tecno ${i}: ${start} - ${end}`);
                    tecnos.push(`tecno ${i}: ${Math.round((start + Number.EPSILON) * 100) / 100} - ${Math.round((end + Number.EPSILON) * 100) / 100}`);

                } else {
                    end = prova_sec[i][i][j - 1][1];
                    console.log(`tecno ${i}: ${start} - ${end}`);
                    tecnos.push(`tecno ${i}: ${Math.round((start + Number.EPSILON) * 100) / 100} - ${Math.round((end + Number.EPSILON) * 100) / 100}`);

                    start = prova_sec[i][i][j][0];
                    end = prova_sec[i][i][j][1];
                    console.log(`tecno ${i}: ${start} - ${end}`);
                    tecnos.push(`tecno ${i}: ${Math.round((start + Number.EPSILON) * 100) / 100} - ${Math.round((end + Number.EPSILON) * 100) / 100}`);

                }
                break;
            }
            if (prova_sec[i][i][j][0] == prova_sec[i][i][j - 1][1]) {

            } else {
                end = prova_sec[i][i][j - 1][1];
                console.log(`tecno ${i}: ${start} - ${end}`);

                tecnos.push(`tecno ${i}: ${Math.round((start + Number.EPSILON) * 100) / 100} - ${Math.round((end + Number.EPSILON) * 100) / 100}`);
                s = j;
            }
        }
    }
    return tecnos;
}