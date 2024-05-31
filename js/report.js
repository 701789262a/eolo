

function drawReport(data) {
    console.log(data);
    //var data = ["1005 Badesi", '3250m', '12.5m', '[120.5, 280.6]', 'FWA-E 100M / 50M / 30M', "260.15"]
    var TextNode = ["Bearing:", 'Bts:', 'Distanza:', 'Heatmap:', 'Settore:', "Tecnologia:"]

    var ul = document.getElementById("lista");

    var li = document.createElement("li")
    var divlist = document.createElement("div")
    divlist.style.cssText = "display: grid;grid-template-columns: repeat(4, 1fr);grid-template-rows: repeat(3, 1fr);grid-column-gap: 0px;grid-row-gap: 0px;margin-top: 18;"
    index = 1;
    TextNode.forEach((item) => {
        var innerdiv = document.createElement("div")
        innerdiv.style.cssText = `grid-area: ${(index % 4) + Math.floor((1 + (Math.floor(index / 4) * 2)) / 3)} / ${1 + (Math.floor(index / 4) * 2)} / ${1 + (index % 4)} / ${2 + (Math.floor(index / 4) * 2)};`;
        console.log(`grid-area: ${(index % 4) + Math.floor((1 + (Math.floor(index / 4) * 2)) / 3)} / ${1 + (Math.floor(index / 4) * 2)} / ${1 + (index % 4)} / ${2 + (Math.floor(index / 4) * 2)};`)
        var btstag = document.createTextNode(item)
        innerdiv.appendChild(btstag);
        divlist.appendChild(innerdiv);
        index += 1
    })
    index = 1;
    for (var item in data) {
        var innerdiv = document.createElement("div")
        innerdiv.style.cssText = `grid-area: ${(index % 4) + Math.floor((1 + (Math.floor(index / 4) * 2)) / 3)} / ${2 + (Math.floor(index / 4) * 2)} / ${2 + (index % 4)} / ${3 + (Math.floor(index / 4) * 2)};`;
        console.log(`grid-area: ${(index % 4) + Math.floor((1 + (Math.floor(index / 4) * 2)) / 3)} / ${2 + (Math.floor(index / 4) * 2)} / ${2 + (index % 4)} / ${3 + (Math.floor(index / 4) * 2)};`)
        var text;
        switch(item){
            case "bearing":
                text = `${Math.floor(data[item]*100)/100} &#176;`;
                break;
            case "bts":
                text = data[item];
                break;
            case "dist":
                text = `${Math.floor(data[item]*100)/100}m`;
                break;
            case "heatmap":
                text = `${Math.floor(data[item]*100)/100}m`;
                if (data[item]>5){
                    image_src = "pngs/nogood.png";
                }else if (data[item]<=5 && data[item]>-1){
                    image_src= "pngs/check.png";
                }else{
                    image_src="pngs/good.png"
                }
                break;  
            case "sector":
                text = `${data[item].toString().replace(",","&#176; => ")}&#176;`;
                if (/\d/.test(data[item])){
                    image_src = "pngs/good.png"
                }else{
                    image_src = "pngs/nogood.png";
                }
                break;  
            case "tecno":
                if ( data[item].toString().includes("Object")){
                    text = "Null"
                    image_src = "pngs/nogood.png";
                }else{
                    text = `${data[item]}`;
                    image_src = "pngs/good.png"
                }
                
                break;
            default:
                console.log("porcodio");
        }
        var btstag = document.createTextNode(text)
        innerdiv.appendChild(btstag);
        if (index >= 4){
            var img = document.createElement('img');
            img.src = image_src;
            img.style.cssText= "height: 10; margin-left:5"
            innerdiv.appendChild(img);
        }
        //innerdiv.appendChild(document.createTextNode("porchiddeu"));
        divlist.appendChild(innerdiv);
        index += 1
    }
    var hr = document.createElement("hr");
    //hr.style.cssText = "height:1px;border-width:0;color:gray;background-color:gray";

    li.appendChild(divlist);
    li.appendChild(hr);
    ul.appendChild(li);
}
