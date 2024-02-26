var map = L.map('map').setView([41.9, 12.5], 10);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);
fetch("lista_bts.json")
                .then((res) => {for (bts in res){
                    console.log(bts);
                    var marker = L.marker([bts['lat'], bts['lng']]).addTo(map);
                }});