import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA-qLNbN7f6tqRSMpqaBwGYk8Vs0QdAZfc",
    authDomain: "zeromistauth.firebaseapp.com",
    projectId: "zeromistauth",
    storageBucket: "zeromistauth.appspot.com",
    messagingSenderId: "66217418367",
    appId: "1:66217418367:web:c8dea8437ca9e0d98be94a",
    measurementId: "G-W869X5G71G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, 'users', loggedInUserId);
        console.log(docRef)
        getDoc(docRef)
            .then((docSnap) => {
                console.log(docSnap)
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('email').innerHTML = userData.email;
                } else {
                    console.log('no document found matching id')
                    window.location.replace('https://eolo.zeromist.net/unauthorized.html')

                }

            }).catch((error) => {
                console.log("error getting document")
                window.location.replace('https://eolo.zeromist.net/unauthorized.html')
            })
    } else {
        console.log('user id not found in local storage')
        window.location.replace('https://eolo.zeromist.net/unauthorized.html')
    }
})


const importManual = document.getElementById('importmanual')
importManual.onclick= function(e){
    console.log('PORCODDIO')
    const id = document.getElementById('id').value
    const lat = document.getElementById('lat').value
    const lng = document.getElementById('lng').value
    const stato = document.getElementById('statoselector').value
    const data = document.getElementById('data').value
    const nome = document.getElementById('nome').value
    const tecno = document.getElementById('tecnoselector').value;

    apiImportBts(id, lat,lng,stato,data, nome, tecno);

}

async function  apiImportBts(id, lat,lng,stato,data, nome, tecno){
    console.log(`https://eolosector.zeromist.net/importbts?nome=${nome}&id=${id}&lat=${lat}&lng=${lng}&stato=${stato}&data=${data}&tecno=${tecno}`)
    var response = await fetch(`https://eolosector.zeromist.net/importbts?nome=${nome}&id=${id}&lat=${lat}&lng=${lng}&stato=${stato}&data=${data}&tecno=${tecno}`,{
        method:'GET'
    })
    var res = await response.json()
}