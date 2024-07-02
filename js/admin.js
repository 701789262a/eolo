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
                if (docSnap.exists()){
                    const userData = docSnap.data();
                    document.getElementById('email').innerHTML = userData.email;
                }else{
                    console.log('no document found matching id')
                    window.location.replace('https://eolo.zeromist.net/unauthorized.html')

                }
                
            }).catch((error)=>{
                console.log("error getting document")
                window.location.replace('https://eolo.zeromist.net/unauthorized.html')
            })
    }else{
        console.log('user id not found in local storage')
        window.location.replace('https://eolo.zeromist.net/unauthorized.html')
    }
})
