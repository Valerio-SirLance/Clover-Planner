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

// Function to open win modal
export function openWinModal() {
    document.getElementById('winModal').style.display = 'block';
}

// Function to close win modal
export function closeWinModal() {
    document.getElementById('winModal').style.display = 'none';
}

// Function to save win
export function saveWin() {
    const winTitle = document.getElementById('winTitleInput').value;
    const winDescription = document.getElementById('winDescriptionInput').value;
    const winDate = document.getElementById('winDateInput').value;
    
    if (winTitle && winDescription && winDate) {
        const winsRef = ref(database, 'smallWins');
        const newWinRef = push(winsRef);
        const timestamp = Date.now();
        set(newWinRef, {
            title: winTitle,
            description: winDescription,
            date: winDate,
            timestamp: timestamp
        }).then(() => {
            alert('Win Successfully Added!');
            closeWinModal();
            location.reload(); 
        }).catch(error => {
            console.error('Error adding win: ', error);
        });
    } else {
        alert('Please Enter Win Title, Description, and Date.');
    }
}

// Function to display wins
function displayWins() {
    const winsContainer = document.getElementById('winsContainer');
    winsContainer.innerHTML = '';

    const winsRef = ref(database, 'smallWins');
    get(winsRef).then(snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const win = childSnapshot.val();
                const winElement = document.createElement('div');
                winElement.className = 'win';
                const winDate = new Date(win.timestamp);
                const formattedDate = `${winDate.getMonth() + 1}/${winDate.getDate()}/${winDate.getFullYear()}`;
                winElement.innerHTML = `
                    <div class="win-header">
                    <div class="win-datetime">${new Date(win.timestamp).toLocaleString()}</div>
                        <div class="win-actions">
                            <button type="button" onclick="import('./script.js').then(module => module.editWin('${childSnapshot.key}', '${win.title}', '${win.description}', '${win.date}'))">
                                <i class="fas fa-edit"></i> <!-- Edit Icon -->
                            </button>
                            <button type="button" onclick="import('./script.js').then(module => module.deleteWin('${childSnapshot.key}'))">
                                <i class="fas fa-trash-alt"></i> <!-- Delete Icon -->
                            </button>
                        </div>
                    </div>
                    <h3>${win.title}</h3>
                    <p>${win.description}</p>
                    <p class="happens">Date Achieved: ${formattedDate}</p>
                `;
                winsContainer.appendChild(winElement);
            });
        } else {
            winsContainer.innerHTML = '<p class="empty">No Wins Yet. Celebrate One!</p>';
        }
    }).catch(error => {
        console.error('Error fetching wins:', error);
    });
}


// Function to edit win
export function editWin(winKey, currentTitle, currentDescription, currentDate) {
    const newTitle = prompt('Enter New Title:', currentTitle);
    const newDescription = prompt('Enter New Description:', currentDescription);
    const newDate = prompt('Enter New Date:', currentDate);
  
    if (newTitle && newDescription && newDate) {
        const winRef = ref(database, 'smallWins/' + winKey);
        update(winRef, {
            title: newTitle,
            description: newDescription,
            date: newDate
        }).then(() => {
            alert('Win Successfully Updated!');
            location.reload(); 
        }).catch(error => {
            console.error('Error updating win: ', error);
        });
    }
}

// Function to delete win
export function deleteWin(winKey) {
  const confirmation = confirm('Are you sure you want to delete this win?');
  if (confirmation) {
      const winRef = ref(database, 'smallWins/' + winKey);
      remove(winRef).then(() => {
          alert('Win Successfully Deleted!');
          location.reload();
      }).catch(error => {
          console.error('Error deleting win: ', error);
      });
  }
}

// Display wins when page loads
window.onload = function() {
    displayWins();
};


// Light / Dark Modes + Mobile Navigation Menu
document.addEventListener('DOMContentLoaded', function() {
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
  
  