var parse_georaster = require("georaster");
var GeoRasterLayer = require("georaster-layer-for-leaflet");

var map = L.map('map').setView([41.9, 12.5], 10);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
osm.addTo(map);
console.log("porcodfffdioueue");
writeBts();

var url_to_geotiff_file = "badesi.tif";
fetch(url_to_geotiff_file)
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    parse_georaster(arrayBuffer).then(georaster => {
      console.log("georaster:", georaster);
      var layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: values => values[0] === 42 ? '#ffffff' : '#000000',
          resolution: 64 // optional parameter for adjusting display resolution
      });
      layer.addTo(map);

      map.fitBounds(layer.getBounds());

  });
});


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
        console.log(`ciaone ${bts_json[bts]['lat']}`);
        var marker = L.marker([bts_json[bts]['lat'], bts_json[bts]['lng']]).addTo(map);
        var popup = marker.bindPopup(`geggiu ${bts_json[bts]['lat']}`).addTo(map);
        
    }
}