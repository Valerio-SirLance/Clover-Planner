import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, push, set, get, update, remove } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';

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

// Log out function
export function logout() {
    // Clear session token
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = "../index.html";
}

// Session Token, Light / Dark Modes, Mobile Navigation Menu
document.addEventListener('DOMContentLoaded', function() {
    // Check for session token
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        // Redirect user back to login page if not logged in
        window.location.href = "../index.html"; 
    }

    const toggleSwitch = document.querySelector('#toggleTheme');
    const toggleSwitchMobile = document.querySelector('#toggleThemeMobile');
    const mobileNav = document.getElementById('mobileNav'); 
    const menuToggle = document.querySelector('.menu-toggle'); 

    toggleSwitch.addEventListener('change', switchTheme);
    toggleSwitchMobile.addEventListener('change', switchTheme);

    menuToggle.addEventListener('click', toggleMenu);

    // Function to close menu when clicking outside
    window.addEventListener('click', function(e) {
        if (!mobileNav.contains(e.target) && e.target !== menuToggle) {
            mobileNav.classList.remove('show-nav');
        }
    });

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        toggleSwitchMobile.checked = true;
    }

    // Toggle menu function
    function toggleMenu() {
        mobileNav.classList.toggle('show-nav');
    }
});
