var map = L.map('map').setView([41.9, 12.5], 10);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);
writeBts();


async function writeBts() {
    var bts_list = await fetch("http://eolo.zeromist.net/lista_bts.json",
                    {mode: "cors", method:"GET",headers: { 
                        "Content-Type": "application/json",
                        },
                    }
            );
    console.log (bts_list.body)
    bts_json = await bts_list.json()
    for (bts in bts_json){
        console.log(`ciaone ${bts}`);
        //var marker = L.marker([bts['lat'], bts['lng']]).addTo(map);
    }
}