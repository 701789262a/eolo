var openbutton = document.getElementsByClassName("info")[0];
var closebutton = document.getElementsByClassName("close-button")[0];
var popup = document.getElementById("popup-window");
openbutton.onclick = function(e) {
    console.log("porcoddio");
    popup.style.display="block";
}
closebutton.onclick = function(e) {
    popup.style.display="none";
}