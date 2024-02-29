// Firebase project configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';

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

// Function for password's eye
export function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
}

// Function to check password
export async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput').value;
    const passwordRef = ref(database, 'password'); 

    try {
        const snapshot = await get(passwordRef);
        const correctPassword = snapshot.val();

        if (passwordInput === correctPassword) {
            console.log("Password Confirmed!");
            // Set session token upon successful login
            sessionStorage.setItem('isLoggedIn', true);
            showModal("Welcome, Sir Lance!");
        } else {
            showModal("Password Incorrect, Try Again!");
        }
    } catch (error) {
        console.error("Error retrieving password:", error);
        showModal("Error retrieving password. Please try again later.");
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
