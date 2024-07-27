import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, push, set, get, update, remove } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Check authentication status
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../index.html";
  }
});

// Function to log out
export function logout() {
    signOut(auth).then(() => {
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = "../index.html";
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
}

// Function to open modal 
export function openGoalModal() {
    const modal = document.getElementById('goalModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 50);
}

// Function to close modal 
export function closeGoalModal() {
    const modal = document.getElementById('goalModal');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Function to save goal
export function saveGoal() {
    const goalTitle = document.getElementById('goalTitleInput').value;
    const goalDescription = document.getElementById('goalDescriptionInput').value;
    const goalDueDate = document.getElementById('goalDueDateInput').value;
    
    if (goalTitle && goalDescription && goalDueDate) {
        const goalsRef = ref(database, 'goals');
        const newGoalRef = push(goalsRef);
        const timestamp = Date.now();
        set(newGoalRef, {
            title: goalTitle,
            description: goalDescription,
            dueDate: goalDueDate,
            timestamp: timestamp
        }).then(() => {
            alert('Goal Successfully Added!');
            closeGoalModal();
            location.reload(); 
        }).catch(error => {
            console.error('Error adding goal: ', error);
        });
    } else {
        alert('Please Enter Goal Title, Description, and Due Date.');
    }
}

// Function to display goals
function displayGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    goalsContainer.innerHTML = '';

    const goalsRef = ref(database, 'goals');
    get(goalsRef).then(snapshot => {
        if (snapshot.exists()) {
            const goalsArray = [];
            snapshot.forEach(childSnapshot => {
                goalsArray.push({ key: childSnapshot.key, value: childSnapshot.val() });
            });

            goalsArray.reverse();

            goalsArray.forEach(goalData => {
                const goal = goalData.value;
                const goalElement = document.createElement('div');
                goalElement.className = 'goal';
                const goalDate = new Date(goal.dueDate);
                const formattedDate = `${goalDate.getMonth() + 1}/${goalDate.getDate()}/${goalDate.getFullYear()}`;
                goalElement.addEventListener('click', () => {
                    openGoalFullModal(goal.title, goal.description, goal.dueDate);
                });
                goalElement.innerHTML = `
                    <div class="goal-header">
                        <div class="goal-datetime">${new Date(goal.timestamp).toLocaleString()}</div>
                        <div class="goal-actions">
                            <button type="button" onclick="import('./script.js').then(module => module.openEditGoalModal('${goalData.key}', '${goal.title}', '${goal.description}', '${goal.dueDate}'))">
                                <i class="fas fa-edit"></i> <!-- Edit Icon -->
                            </button>
                            <button type="button" onclick="import('./script.js').then(module => module.deleteGoal('${goalData.key}'))">
                                <i class="fas fa-trash-alt"></i> <!-- Delete Icon -->
                            </button>
                        </div>
                    </div>
                    <h3>${goal.title}</h3>
                    <p class="description">${goal.description}</p>
                    <p class="happens">Target Date: ${formattedDate}</p>
                `;
                goalsContainer.appendChild(goalElement);
            });
        } else {
            goalsContainer.innerHTML = '<p class="empty">No Goals Yet. Set One!</p>';
        }
    }).catch(error => {
        console.error('Error fetching goals:', error);
    });
}

// Function to open modal with full goal content
export function openGoalFullModal(title, description, dueDate) {
    const modal = document.getElementById('goalFullModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalContent');
    const modalDate = document.getElementById('modalDate');
    const goalDate = new Date(dueDate);
    const formattedDate = `${goalDate.getMonth() + 1}/${goalDate.getDate()}/${goalDate.getFullYear()}`;
  
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalDate.innerHTML = `Target Date: ${formattedDate}`;
  
    modal.style.display = 'block';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 50);
  }
  
  // Function to close modal 
  export function closeGoalFullModal() {
    const modal = document.getElementById('goalFullModal');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
  }


// Function to open edit modal 
export function openEditGoalModal(goalKey, currentTitle, currentDescription, currentDueDate) {
    const modal = document.getElementById('editGoalModal');
    const editGoalTitleInput = document.getElementById('editGoalTitleInput');
    const editGoalDescriptionInput = document.getElementById('editGoalDescriptionInput');
    const editGoalDueDateInput = document.getElementById('editGoalDueDateInput');
  
    editGoalTitleInput.value = currentTitle;
    editGoalDescriptionInput.value = currentDescription;
    editGoalDueDateInput.value = currentDueDate;
    document.getElementById('editGoalKey').value = goalKey;
  
    modal.style.display = 'block';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 50);
}

// Function to close edit modal 
export function closeEditGoalModal() {
    const modal = document.getElementById('editGoalModal');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Function to save edited goal
export function saveEditedGoal() {
    const goalKey = document.getElementById('editGoalKey').value;
    const newTitle = document.getElementById('editGoalTitleInput').value;
    const newDescription = document.getElementById('editGoalDescriptionInput').value;
    const newDueDate = document.getElementById('editGoalDueDateInput').value;
  
    if (newTitle && newDescription && newDueDate) {
        const goalRef = ref(database, 'goals/' + goalKey);
        update(goalRef, {
            title: newTitle,
            description: newDescription,
            dueDate: newDueDate
        }).then(() => {
            alert('Goal Successfully Updated!');
            closeEditGoalModal();
            location.reload(); 
        }).catch(error => {
            console.error('Error updating goal: ', error);
        });
    } else {
        alert('Please Enter Goal Title, Description, and Due Date.');
    }
}

// Function to delete goal
export function deleteGoal(goalKey) {
  const confirmation = confirm('Are you sure you want to delete this goal?');
  if (confirmation) {
      const goalRef = ref(database, 'goals/' + goalKey);
      remove(goalRef).then(() => {
          alert('Goal Successfully Deleted!');
          location.reload();
      }).catch(error => {
          console.error('Error deleting goal: ', error);
      });
  }
}

// Display goals when page loads
window.onload = function() {
    displayGoals();
};

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
  
  