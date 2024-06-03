const input = document.getElementById('input');
const lista = document.getElementById('listahint');
const blocco = document.getElementById('hint');
var btsClicked = document.getElementById('rowhint');

input.addEventListener("keyup", (event) => {
    try {
        if (input == document.activeElement) {
            console.log(`focus and show hint 1 ${event.val} ${input.value}`);
            //blocco.style.zIndex="900";
            //lista.style.zIndex="900";
            console.log('ciao')
            loadHint(input.value);

        }
        if (input.value == "") {
            console.log('defocus 2');
            document.getElementById("hint").remove();
        }
    }
    catch (e) {

    }
});

window.addEventListener('focusin', function (e) {
    if (this.document.activeElement.id == 'rowhint'){
        console.log(this.document.activeElement.textContent)
        for(bts in bts_json){
            if (bts_json[bts]['nome']==this.document.activeElement.textContent){
                map.flyTo([bts_json[bts]['lat'], bts_json[bts]['lng']], 15);
                break;
            }
        }
        
    }
    if (input != this.document.activeElement ) {
        console.log('defocus 1');
        document.getElementById("hint").remove();
    } else {
        
        if (input.value != "") {
            console.log(`focus and show hint 2${input.value}`);
            loadHint(input.value);
        }
    }

});


async function loadHint(partiallyFilledBts) {
    var viewportOffset = input.getBoundingClientRect();
    var width = viewportOffset.right - viewportOffset.left + 40;

    try {
        document.getElementById('listahint').remove()

    } catch (e) {

    }
    var maindiv = document.getElementById('hint');
    if (document.getElementById('hint') != null) {
        console.log('leggo maindiv')
        maindiv = document.getElementById('hint')
    } else {
        console.log('creo maindiv')
        maindiv = document.createElement('div');
        maindiv.id = 'hint';
    }

    maindiv.style.left = viewportOffset.left - 20;
    maindiv.style.width = width;

    ul = document.createElement('ul')
    ul.id = "listahint"
    maindiv.appendChild(ul)
    document.body.appendChild(maindiv)



    var bts_list = await fetch("https://eolo.zeromist.net/lista_bts.json",
        {
            mode: "cors", method: "GET", headers: {
                "Content-Type": "application/json",
            },
        }
    );
    bts_json = await bts_list.json();
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }

    for (bts in bts_json) {
        if (bts_json[bts]['nome'].toLowerCase().includes(partiallyFilledBts.toLowerCase())) {
            //console.log(bts_json[bts]['nome'])
            //row = document.createTextNode(bts_json[bts]['nome']);
            row = document.createElement('button');
            row.id = "rowhint"
            rowText = document.createTextNode(bts_json[bts]['nome'])
            
            row.appendChild(rowText)
            row.addEventListener('click',e => {
                console.log(`click ${e.target.innerText}`)
            })
            
            li = document.createElement('li');
            li.style ="list-style-type: none;  margin: 0;padding: 0;"
            li.appendChild(row)
            //li.append(sep)
            ul.appendChild(li)

        }
    }
}

