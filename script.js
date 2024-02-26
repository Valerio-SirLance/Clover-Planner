// Firebase project configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';

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
        showModal("Welcome, Sir Lance!");
    } else {
        // Password incorrect, show error message
        showModal("Password Incorrect, Try Again!");
    }
}

/* JS of Modals */
// Function to show modal
function showModal(message) {
    const modal = document.getElementById('passwordModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalMessage = document.getElementById('modalMessage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    modalOverlay.style.zIndex = 1;
    modalCloseBtn.style.zIndex = 1;

    document.body.classList.add('modal-open');

    if (message === "Welcome, Sir Lance!") {
        modalCloseBtn.addEventListener('click', function() {
            window.location.href = "./home/home.html"; 
        });
    }
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('passwordModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    modal.style.display = 'none';
    modalOverlay.style.zIndex = -1;

    document.body.classList.remove('modal-open');
}

// Attach event listener to modal close button
const modalCloseBtn = document.getElementById('modalCloseBtn');
modalCloseBtn.addEventListener('click', closeModal);

/* End of JS of Modals */