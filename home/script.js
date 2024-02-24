import { initializeApp } from
    'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, push, set, get, update, remove } from
    'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';


// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeJlqfAu___gl2PxqVg9VNgjErlCmIxxQ",
    authDomain: "clover-planner.firebaseapp.com",
    databaseURL: "https://clover-planner-default-rtdb.firebaseio.com",
    projectId: "clover-planner",
    storageBucket: "clover-planner.appspot.com",
    messagingSenderId: "936646667254",
    appId: "1:936646667254:web:afd6229dd483c07140b5d7"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('#toggleTheme');
    toggleSwitch.addEventListener('change', switchTheme);

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
});
