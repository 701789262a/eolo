headers = {
    'method': 'GET',
    'scheme': 'https',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,es;q=0.5,zh-CN;q=0.4,zh;q=0.3',
    'Referer': 'https://www.ivynet.it/copertura/raw',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'frontend_lang=it_IT; session_id=f195ee4a8586d5b0ac4a7ec2886169701a285dff',
}
var width = document.body.clientWidth;
if (width<768){
    for (var i=0; i<4; i++){
        var topinfonumber = document.getElementsByClassName("topinfonumber")[i];
        topinfonumber.style.color = "transparent";

    }
    
}else{
    for (var i=0; i<4; i++){
        var topinfonumber = document.getElementsByClassName("topinfonumber")[i];
        topinfonumber.style.color = "black";

    }
}
window.onresize = function(event) {
    var width = document.body.clientWidth;
    
    const input = document.getElementById('input');
    const blocco = document.getElementById('hint');
    var viewportOffset = input.getBoundingClientRect();
    blocco.style.left = viewportOffset.left;
    var width = viewportOffset.right - viewportOffset.left;
    blocco.style.width = width;
if (width<768){
    for (var i=0; i<4; i++){
        var topinfonumber = document.getElementsByClassName("topinfonumber")[i];
        topinfonumber.style.color = "transparent";

    }
    
}else{
    for (var i=0; i<4; i++){
        var topinfonumber = document.getElementsByClassName("topinfonumber")[i];
        topinfonumber.style.color = "black";

    }
}
};

var selectedBts = "";
//var georastervalues;
var map = L.map('map').setView([40.96155, 8.872], 11);


var osm = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.arcgis.com/">Arcgis</a>',
    zoomControl: false

});
map.zoomControl.remove();
L.control.zoom({
    position: 'bottomright'
}).addTo(map);
map.on('contextmenu', async function(e){
    console.log('porcoddio');
            if (selectedBts!="") {
               //alert("ctr key was pressed during the click");
               console.log(e);
               await queryIvynet(e['latlng']['lat'],e['latlng']['lng'],selectedBts,bts_list_latlng);
            }
            if (!(selectedBts!="")) {
                //alert("ctr key was pressed during the click");
                console.log(e);
                await generateReport(e['latlng']['lat'],e['latlng']['lng']);
             }
        
});
map.on('click',function(e){
    document.body.onclick = async function (f) {
        if (f.ctrlKey && selectedBts!="") {
           //alert("ctr key was pressed during the click");
           console.log(e);
           await queryIvynet(e['latlng']['lat'],e['latlng']['lng'],selectedBts,bts_list_latlng);
        }
        if (f.ctrlKey && !(selectedBts!="")) {
            //alert("ctr key was pressed during the click");
            console.log(e);
            await generateReport(e['latlng']['lat'],e['latlng']['lng']);
         }
    }
});



var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [38, 95],
       shadowSize:   [50, 64],
       iconAnchor:   [22, 94],
       shadowAnchor: [4, 62],
       popupAnchor:  [-3, -76]
    }
});
var greenIcon = new LeafIcon({
    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
})
real_sectors=[];
osm.addTo(map);
writeBts();
makka = []
async function writeBts() {
    var bts_list = await fetch("https://eolo.zeromist.net/lista_bts.json",
        {
            mode: "cors", method: "GET", headers: {
                "Content-Type": "application/json",
            },
        }
    );
    bts_json = await bts_list.json();
    var markers = L.markerClusterGroup({
        layer_base: true,
        maxClusterRadius: 100,
        spiderfyOnMaxZoom: false, showCoverageOnHover: true, zoomToBoundsOnClick: true, chunkedLoading: true
    }
    );
    bts_list_latlng= new Object()
    for (bts in bts_json) {
        
        marker = L.marker([bts_json[bts]['lat'], bts_json[bts]['lng']], {
            name: bts_json[bts]['nome'],
            tecno: bts_json[bts]['tech_string'],
            id : bts_json[bts]['id']
        }).on('click', await onClick);
        bts_list_latlng[bts_json[bts]['nome']] = marker.getLatLng();
        var popup = marker.bindPopup(`${bts_json[bts]['nome']}`)
        markers.addLayer(marker);

    }
    markers.addTo(map);
    //map.addLayer(markers);
    makka.push(markers);
}
const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
const verIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

async function generateReport(lat, lng){
    var ul = document.getElementById("lista");
    while (ul.firstChild) { 
        ul.removeChild(ul.firstChild); 
    }
    var reportpopup = document.getElementsByClassName('report')[0];
    reportpopup.style.display="block";
    //window.open('getreport.html',"","width=700, height=500");
    console.log("porcoddioreport");
    
    response = await fetch(`https://eoloapi.zeromist.net/getreport?lat=${lat}&lng=${lng}`, {
         method: "GET"
    });
    report = await response.json();
    var ul = document.getElementById("lista");
    while (ul.firstChild) { 
        ul.removeChild(ul.firstChild); 
    }
    report.forEach((item) => {
        console.log(`item ${item}`);
        drawReport(item);
    })
        
    
}

async function queryIvynet(lat,lng,selectedBts,bts_list_latlng){
    console.log(`coordz ${bts_list_latlng[selectedBts].lat}`)
    marker = L.marker([lat, lng], {
        icon: redIcon,
        name: selectedBts});
    try{
        layergroup.clearLayers();
    }
    catch(e){

    }
    console.log(bts_list_latlng[selectedBts]);
    console.log(marker.getLatLng());
    bearing = L.GeometryUtil.bearing(bts_list_latlng[selectedBts], marker.getLatLng());
    if (bearing <0){
        bearing = 360 + bearing;
    }
    console.log(`${bearing} degree`);
    layergroup=L.layerGroup([marker])
        .addTo(map);
    console.log(selectedBts);
    response = await fetch(`https://eoloapi.zeromist.net/getinventory?lat=${lat}&lng=${lng}&bts=${selectedBts}`, {
         method: "GET"
    });
    click_tecno = await response.json();
    console.log(click_tecno);

    // change marker color

    layergroup.clearLayers();
    marker = L.marker([lat, lng], {
        icon: verIcon,
        name: selectedBts});
    layergroup=L.layerGroup([marker])
        .addTo(map);

    // Get value GeoTIFF
    var heatmap_value_url = `https://eolosector.zeromist.net/getheatmapvalue?bts=${selectedBts}&lat=${lat}&lng=${lng}`;
    response = await fetch (heatmap_value_url,{
        method:"GET"
    });
    heatmap_value = await response.json();
    console.log(`heat ${heatmap_value['height']}`);

    document.getElementById('menu').innerHTML= `<p style="margin-top: 0; padding: 0;font-size: 14;">@ LAT ${Math.round(lat*1000000)/1000000} / LON ${Math.round(lng*1000000)/1000000} <br> 
        &rArr; Copertura: ${JSON.stringify(click_tecno['tecno']).replace(/"/g, "")}<br>
        &rArr; Heatmap: ${heatmap_value['height']}</p>`;
    marker_tecnology = `tecno ${click_tecno['tecno'].split("").filter((char)=> char === "M").length}`;
    sector_point=false
    present_sector= false
    for (single_sector in real_sectors){
        console.log(marker_tecnology);
        splitted_sector_definition=real_sectors[single_sector].split(';')
        console.log(splitted_sector_definition);
        if (splitted_sector_definition[0]==marker_tecnology){
            present_sector=true;
        }
        if (bearing > splitted_sector_definition[1] && bearing < splitted_sector_definition[2] && marker_tecnology==splitted_sector_definition[0]){
            sector_point= true;
        }
    }
    console.log(sector_point);
    if (!sector_point && present_sector){
        console.log('Discrepancy!');
        for (single_sector in real_sectors){
            splitted_sector_definition=real_sectors[single_sector].split(';')
            if (splitted_sector_definition[1]-bearing < 5 && splitted_sector_definition[1]-bearing >0 &&marker_tecnology==splitted_sector_definition[0]){
                console.log(`extend sector counterclockwise from ${splitted_sector_definition[1]} to ${bearing}`);
                var richiesta = window.confirm(`Discrepanza rilevata! Modificare l'inizio del settore da ${splitted_sector_definition[1]} a ${bearing}`);
            }
            if (bearing - splitted_sector_definition[2] < 5 && bearing - splitted_sector_definition[2] >0 &&  marker_tecnology==splitted_sector_definition[0]){
                console.log(`extend sector clockwise from ${splitted_sector_definition[2]} to ${bearing}`);
                var richiesta = window.confirm(`Discrepanza rilevata! Modificare la fine del settore da ${splitted_sector_definition[2]} a ${bearing}`);
            }
            console.log(richiesta);
            // api request modificare settore
            if (richiesta){
                var push_point = await fetch(`https://eolosector.zeromist.net/changesector?bts=${selectedBts}&bts_lat=${bts_list_latlng[selectedBts].lat}&bts_lng=${bts_list_latlng[selectedBts].lng}&lat=${lat}&lng=${lng}&tecno=${marker_tecnology.split(" ")[1]}`);
                console.log(push_point.status)
                if (push_point.status==200){
                    console.log('ok');
                    // Update sector
                    updateSectorsOnDiscrepancy({"latlng":{'lat':bts_list_latlng[selectedBts].lat,'lng':bts_list_latlng[selectedBts].lng}},selectedBts);
                }
            }
        }
    }
}
async function getSectors(bts_name,bts_lat,bts_lng) {
    var sectors = await fetch(`https://eolosector.zeromist.net/getsector?bts=${bts_name}&bts_lat=${bts_lat}&bts_lng=${bts_lng}`);
    if (sectors.status !== 200) {
        return 0;
    }
    sekt = await sectors.json();
    console.log(`sekt ${JSON.stringify(sekt)}`);
    return (sekt);
}

const textInput = document.getElementById('input');

textInput.addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        console.log(textInput.value);
        var bts_list = await fetch("https://eolo.zeromist.net/lista_bts.json",
        {
            mode: "cors", method: "GET", headers: {
                "Content-Type": "application/json",
            },
        }
        );
        bts_json = await bts_list.json();
        for (bts in bts_json){
            if ((bts_json[bts]['nome'].toLowerCase() == textInput.value.toLowerCase() )|| (bts_json[bts]['id']== textInput.value.toLowerCase())){
                console.log(`${[bts_json[bts]['lat'], bts_json[bts]['lng']]}`);
                map.flyTo([bts_json[bts]['lat'], bts_json[bts]['lng']], 15);
            }
        }
    }
});

async function updateSectorsOnDiscrepancy(e, selectedBts){
    map.eachLayer(function(layer){
        if (layer['options']['removable']===true && layer['options']['map']===false){
            map.removeLayer(layer);
        }
    });
    sesso = await getSectors(selectedBts,e.latlng['lat'], e.latlng['lng']);

    console.log(`porcodio sesso ${sesso}`);
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
    tecno_colors ={
        'tecno 1':'rgb(255,0,0)',
        'tecno 2':'rgb(0,255,0)',
        'tecno 3':'rgb(0,0,255)',
    }
    
    real_sectors=[];
    if (tecnos_filtered != ":C") {
        for (let k = 0; k < tecnos_filtered.length; k++) {
            this_sector = tecnos_filtered[k].split(':')[1].split('-');
            if (this_sector[1]==0){
                try{
                    if (tecnos_filtered[k].split(':')[0] == tecnos_filtered[k+1].split(':')[0]){
                        end_sector[1] = tecnos_filtered[k+1].split(':')[1].split('-');
                    }else{
                        end_sector[1]=360;
                    }
                }catch(e){
                    end_sector[1]=360;
                }
                

            }
            else{
                end_sector = tecnos_filtered[k].split(':')[1].split('-');
            }
            if (parseInt(this_sector[0]) <= 5){
                //var url_to_geotiff_file = `https://eolo.zeromist.net/images/${this.options.name}.tif`;
                this_sector[0] = 0;
            }
            outer_sector = 10000;
            real_sectors.push(`${tecnos_filtered[k].split(':')[0]};${parseInt(this_sector[0])};${parseInt(end_sector[1])}`);
            switch (tecnos_filtered[k].split(':')[0]){
                case 'tecno 1':
                    outer_sector = 25000;
                    break;
                
                case 'tecno 2':
                    outer_sector = 8000;
                    break;
                case 'tecno 3':
                    outer_sector = 23000;
                    break;
            }
            console.log(`outer sect ${outer_sector}`);
            if (tecnos_filtered[k].split(':')[0] == 'tecno 3'){
                
                L.sector({
                    removable:true,
                    map:false,
                    center: [e.latlng['lat'], e.latlng['lng']],
                    innerRadius: 8000,
                    outerRadius: 25000,
                    startBearing: parseInt(this_sector[0]),
                    endBearing: parseInt(end_sector[1]),
                    numberOfPoints: 100,
                    color: tecno_colors['tecno 1']
                }).addTo(map);
                L.sector({
                    removable:true,
                    map:false,
                    center: [e.latlng['lat'], e.latlng['lng']],
                    innerRadius: 0,
                    outerRadius: 8000,
                    startBearing: parseInt(this_sector[0]),
                    endBearing: parseInt(end_sector[1]),
                    numberOfPoints: 100,
                    color: tecno_colors['tecno 3']
                }).addTo(map);
            }else{
                L.sector({
                    removable:true,
                    map:false,
                    center: [e.latlng['lat'], e.latlng['lng']],
                    innerRadius: 0,
                    outerRadius: outer_sector,
                    startBearing: parseInt(this_sector[0]),
                    endBearing: parseInt(end_sector[1]),
                    numberOfPoints: 100,
                    color: tecno_colors[tecnos_filtered[k].split(':')[0]]
                }).addTo(map);
            }

        }
    }
    console.log(real_sectors);
    console.log(tecnos_filtered);
    console.log(this.options.name);
    
    document.getElementById('id').innerHTML = `<p>${this.options.id}</p>`;
    document.getElementById('name').innerHTML = `<p>${this.options.name}</p>`;
    document.getElementById('lat').innerHTML = `<p>${e.latlng['lat']}</p>`;
    document.getElementById('lng').innerHTML = `<p>${e.latlng['lng']}</p>`;
    document.getElementById('sec').innerHTML = `<p>${tecnos_filtered.join(" <br>")}</p>`;
    document.getElementById('tecno').innerHTML = `<p>${this.options.tecno.replace("EOLO","").replace("EOLO","")}</p>`;
}
async function onClick(e) {
    selectedBts = this.options.name;
    console.log(selectedBts);
    console.log(map);
    map.eachLayer(function(layer){
        if (layer['options']['removable']===true){
            map.removeLayer(layer);
        }
    });

    var url_to_geotiff_file = `https://eolo.zeromist.net/images/${this.options.name}.tif`;

    fetch(url_to_geotiff_file)
        .then(function (response) {
             response.arrayBuffer().then(function (arrayBuffer) {
             parseGeoraster(arrayBuffer).then((georaster) => {
                georaster.options = { left: 0, top: 0, right: 4000, bottom: 4000, width: 10, height: 10 };
                var scale = chroma.scale(["cyan", "cyan", "cyan", "yellow", "red"]).domain([-7, 5]);
                var layer = new GeoRasterLayer({
                    map: true,
                    removable:true,
                    opacity: 0.5,
                    georaster: georaster,
                    resampleMethod: 'bilinear',
                    //updateWhenZooming: false,
                    options : { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 },
                    resolution:32,
                    pixelValuesToColorFn: function (values) {
                        //console.log(values);
                        const value = values[0];
                        //if (value == -4) return "rgb(0, 0, 0)";
                        
                        //if (value < -5) return "rgba(0, 0, 0,0)";
                        if (values[3] == 0) { return "rgba(0,0,0,0)" };
                        if (value > 5) { return "rgba(0,0,0,0)" };
                        return scale(value).hex();
                    }
                });
                layer.addTo(map);
                map.fitBounds(layer.getBounds());

            });
        });});
    var customPane = map.createPane("customPane");
    var canvasRenderer = L.canvas({ pane: customPane });

    //L.Polyline.Arc([41.041757, 8.8791], [43.874678, 8.839416],{vertices: 200}).addTo(map);
    //var pathOne = L.curve(['M', [e.latlng['lat'], e.latlng['lng']],
    //   'L', [41.041757, 8.8791],

    //    'Z'], { animate: 3000, renderer: canvasRenderer }).addTo(map);
    sesso = await getSectors(this.options.name,e.latlng['lat'], e.latlng['lng']);

    console.log(`porcodio sesso ${sesso}`);
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
    tecno_colors ={
        'tecno 1':'rgb(255,0,0)',
        'tecno 2':'rgb(0,255,0)',
        'tecno 3':'rgb(0,0,255)',
    }
    
    real_sectors=[];
    if (tecnos_filtered != ":C") {
        for (let k = 0; k < tecnos_filtered.length; k++) {
            this_sector = tecnos_filtered[k].split(':')[1].split('-');
            if (this_sector[1]==0){
                try{
                    if (tecnos_filtered[k].split(':')[0] == tecnos_filtered[k+1].split(':')[0]){
                        end_sector[1] = tecnos_filtered[k+1].split(':')[1].split('-');
                    }else{
                        end_sector[1]=360;
                    }
                }catch(e){
                    end_sector[1]=360;
                }
                

            }
            else{
                end_sector = tecnos_filtered[k].split(':')[1].split('-');
            }
            if (parseInt(this_sector[0]) <=5){
                this_sector[0] = 0;
            }
            outer_sector = 10000;
            real_sectors.push(`${tecnos_filtered[k].split(':')[0]};${parseInt(this_sector[0])};${parseInt(end_sector[1])}`);
            switch (tecnos_filtered[k].split(':')[0]){
                case 'tecno 1':
                    outer_sector = 25000;
                    break;
                
                case 'tecno 2':
                    outer_sector = 8000;
                    break;
                case 'tecno 3':
                    outer_sector = 23000;
                    break;
            }
            console.log(`outer sect ${outer_sector}`);
            if (tecnos_filtered[k].split(':')[0] == 'tecno 3'){
                
                L.sector({
                    removable:true,
                    map:false,
                    center: [e.latlng['lat'], e.latlng['lng']],
                    innerRadius: 8000,
                    outerRadius: 25000,
                    startBearing: parseInt(this_sector[0]),
                    endBearing: parseInt(end_sector[1]),
                    numberOfPoints: 100,
                    color: tecno_colors['tecno 1']
                }).addTo(map);
                L.sector({
                    removable:true,
                    map:false,
                    center: [e.latlng['lat'], e.latlng['lng']],
                    innerRadius: 0,
                    outerRadius: 8000,
                    startBearing: parseInt(this_sector[0]),
                    endBearing: parseInt(end_sector[1]),
                    numberOfPoints: 100,
                    color: tecno_colors['tecno 3']
                }).addTo(map);
            }else{
                L.sector({
                    removable:true,
                    map:false,
                    center: [e.latlng['lat'], e.latlng['lng']],
                    innerRadius: 0,
                    outerRadius: outer_sector,
                    startBearing: parseInt(this_sector[0]),
                    endBearing: parseInt(end_sector[1]),
                    numberOfPoints: 100,
                    color: tecno_colors[tecnos_filtered[k].split(':')[0]]
                }).addTo(map);
            }

        }
    }
    console.log(real_sectors);
    console.log(tecnos_filtered);
    console.log(this.options.name);
    document.getElementById('id').innerHTML = `<p>${this.options.id}</p>`;
    document.getElementById('name').innerHTML = `<a target="_blank" href="https://www.google.it/maps/@${e.latlng['lat']},${e.latlng['lng']},427m/data=!3m1!1e3?entry=ttu">${this.options.name}</p>`;
    document.getElementById('lat').innerHTML = `<p>${e.latlng['lat']}</p>`;
    document.getElementById('lng').innerHTML = `<p>${e.latlng['lng']}</p>`;
    document.getElementById('sec').innerHTML = `<p>${tecnos_filtered.join(" <br>")}</p>`;
    document.getElementById('tecno').innerHTML = `<p>${this.options.tecno.replace("EOLO","").replace("EOLO","")}</p>`;
}

function getSectorCoverage(prova_sec) {
    var tecnos = []
    for (let i = 1; i < 4; i++) {
        for (let k = 0; k<Object.keys(prova_sec['tecno'][i-1][i]).length;k++){
            tecnos.push(`tecno ${i}: ${prova_sec['tecno'][i-1][i][k][0]} - ${prova_sec['tecno'][i-1][i][k][1]}`)
            console.log(`tecno ${i}: ${prova_sec['tecno'][i-1][i][k][0]} - ${prova_sec['tecno'][i-1][i][k][1]}`)
        }
    }
    console.log(tecnos);
    
    return tecnos;
}