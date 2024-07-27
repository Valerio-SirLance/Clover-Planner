import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Function to hash a password 
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export async function checkPassword() {
    try {
        await signInAnonymously(auth);
        const passwordInput = document.getElementById('passwordInput').value;
        const hashedPasswordInput = await hashPassword(passwordInput);
        
        const passwordRef = ref(database, 'password');
        const snapshot = await get(passwordRef);
        const storedPassword = snapshot.val(); 

        if (hashedPasswordInput === storedPassword) {
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

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    checkPassword();
});

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

function closeModal() {
    const modal = document.getElementById('passwordModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    modal.style.display = 'none';
    modalOverlay.style.zIndex = -1;

    document.body.classList.remove('modal-open');
}

const modalCloseBtn = document.getElementById('modalCloseBtn');
modalCloseBtn.addEventListener('click', closeModal);
