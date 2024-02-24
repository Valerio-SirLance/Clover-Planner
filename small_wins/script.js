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
            location.reload(); // Reload the page
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
                winElement.innerHTML = `
                    <h3>${win.title}</h3>
                    <p>${win.description}</p>
                    <p>Date: ${win.date}</p>
                    <p>${new Date(win.timestamp).toLocaleString()}</p>
                    <div class="buttons">
                        <button type="button" onclick="import('./script.js').then(module => module.editWin('${childSnapshot.key}', '${win.title}', '${win.description}', '${win.date}'))">
                            Edit
                        </button>
                        <button type="button" onclick="import('./script.js').then(module => module.deleteWin('${childSnapshot.key}'))">
                            Delete
                        </button>
                    </div>
                `;
                winsContainer.appendChild(winElement);
            });
        } else {
            winsContainer.innerHTML = '<p>No Wins Yet. Celebrate One!</p>';
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
            location.reload(); // Reload the page
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
          location.reload(); // Reload the page
      }).catch(error => {
          console.error('Error deleting win: ', error);
      });
  }
}

// Display wins when page loads
window.onload = function() {
    displayWins();
};
