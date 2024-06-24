var openbutton = document.getElementsByClassName("info")[0];
var hideshow = document.getElementsByClassName("hideshow")[0];
var closebutton = document.getElementsByClassName("close-button")[0];
var popup = document.getElementById("popup-window");
var report = document.getElementsByClassName("report")[0];
var reportclose = document.getElementById("closereport");
var menu = document.getElementById("menu");
const defaultMenuHeight= "75"
const expandedMenuHeight= "225"
const graphHeight ="150"
menu.addEventListener('click', function() {
    // specify the action to take when the div is clicked
    console.log(menu.style.height)
    if(menu.style.height=="75px" || menu.style.height=="" ){
        document.getElementById("myChart").style.display="block";
        menu.style.height=expandedMenuHeight;
    }else{
        menu.style.height=defaultMenuHeight;
        document.getElementById("myChart").style.display="none";

    }
    
  });
reportclose.onclick = function (e) {
    var report = document.getElementsByClassName("report")[0];
    report.style.display = "none";
}
openbutton.onclick = function (e) {
    console.log("porcoddio");
    popup.style.display = "block";
}
closebutton.onclick = function (e) {
    popup.style.display = "none";
}
hideshow.onclick = function(e){
    var rightmenu = document.getElementById('rightmenu');
    if (rightmenu.style.zIndex == "900"  || rightmenu.style.zIndex == ""){
        rightmenu.style.zIndex = "0";
    }else{
        rightmenu.style.zIndex = "900";
    }
    
}
