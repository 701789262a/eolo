

var map = L.map('map').setView([41.9, 12.5], 10);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);
console.log("porcodfffdioueue");
writeBts();


async function writeBts() {
  console.log("porcoddio");
    var bts_list = await fetch("https://eolo.zeromist.net/lista_bts.json",
                    {mode: "cors", method:"GET",headers: { 
                        "Content-Type": "application/json",
                        },
                    }
            );
    console.log (`diocai ${bts_list.body}`);
    bts_json = await bts_list.json();
    for (bts in bts_json){
        var marker = L.marker([bts_json[bts]['lat'], bts_json[bts]['lng']]).addTo(map).on('click',onClick);
        var popup = marker.bindPopup(`geggiu ${bts_json[bts]['lat']}`).addTo(map);
        
    }
}

function onClick(e) {
    console.log(e.latlng);
    document.getElementById('lat').innerHTML= `<p>${e.latlng['lat']}</p>`;
    document.getElementById('lng').innerHTML= `<p>${e.latlng['lng']}</p>`;
}