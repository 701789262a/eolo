

var map = L.map('map').setView([41.9, 12.5], 10);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);
writeBts();

var prova_sec = [{"0": {"0": [26.56505117711001, 36.86989764585428], "1": [53.13010235420208, 0], "2": [69.4439547804161, 0], "3": [95.1944289077272, 119.74488129695602], "4": [153.43494882287078, 153.434948822922], "5": [180.0, 0], "6": [198.4349488229028, 0], "7": [210.96375653207073, 0], "8": [236.30993247403006, 270.000000000064], "9": [285.2551187030364, 292.6198649480465]}}, {"1": {}}, {"2": {"0": [0.0, 360]}}]
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
             sectors:  prova_sec,
             tecno: bts_json[bts]['tech_string']
            }).addTo(map).on('click', onClick);
        var popup = marker.bindPopup(`${bts_json[bts]['nome']}`).addTo(map);

    }
}

function onClick(e) {
    tecnos_filtered =[]
    tecnos = getSectorCoverage();
    for (let i = 0; i < Object.keys(tecnos).length; i++){
        if (!tecnos[i].includes("tecno 0")){
            tecnos_filtered.push(tecnos[i]);
        }
    }
    console.log(tecnos_filtered);
    console.log(this.options.name);
    document.getElementById('lat').innerHTML = `<p>${e.latlng['lat']}</p>`;
    document.getElementById('lng').innerHTML = `<p>${e.latlng['lng']}</p>`;
    document.getElementById('sec').innerHTML = `<p>${tecnos_filtered}</p>`;
    document.getElementById('tecno').innerHTML = `<p>${this.options.tecno}</p>`;
}

function getSectorCoverage(){
    var tecnos = []
    for (let i = 0 ; i < 3; i++){
        try{
            console.log(Object.keys(prova_sec[i][i]).length);
        }catch(e){
            console.log(`error ${i}`);
            continue
        }
        
        part_len = Object.keys(prova_sec[i][i]).length-1;
        for (let j = 0; j < part_len; j++){
            if (prova_sec[i][i][j][1] == 0){
                prova_sec[i][i][j][1] = prova_sec[i][i][j+1][0];
            }
            //console.log(prova_sec[i][i][j]);
        }
    }
    for (let i = 0 ; i < 3; i++){
        
        s=0
        try{
            console.log(Object.keys(prova_sec[i][i]).length);
        }catch(e){
            console.log(`error ${i}`);
            continue
        }
        if (Object.keys(prova_sec[i][i]).length ==1 ){
            //console.log(`tecno ${i}: ${prova_sec[i][i][0][0]} - ${prova_sec[i][i][0][1]}`);
            tecnos.push(`tecno ${i}: ${Math.round((prova_sec[i][i][0][0] + Number.EPSILON) * 100) / 100} - ${Math.round((prova_sec[i][i][0][1] + Number.EPSILON) * 100) / 100}`);
        }
        
        for (let j = 1; j < Object.keys(prova_sec[i][i]).length; j++){
            start = prova_sec[i][i][s][0];
            if (prova_sec[i][i][j][0] == prova_sec[i][i][j-1][1]){

            }else{
                end = prova_sec[0][i][j-1][1]
                //console.log(`tecno ${i}: ${start} - ${end}`);
                
                tecnos.push(`tecno ${i}: ${Math.round((start + Number.EPSILON) * 100) / 100} - ${Math.round((end + Number.EPSILON) * 100) / 100}`);
                s=j;
            }
        }
    }
    return tecnos;
}