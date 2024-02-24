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

// Function to check password
export function checkPassword() {
    const passwordInput = document.getElementById('passwordInput').value;
    const correctPassword = "Clover0320";
    // Password correct, proceed to home page
    if (passwordInput === correctPassword) {
      alert("Welcome, Lance!");
      window.location.href = "./home/home.html"; 
    } else {
      // Password incorrect, show error message
      alert("Password Incorrect, Try Again!");
    }
  }