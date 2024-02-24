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

// Function to open goal modal
export function openGoalModal() {
    document.getElementById('goalModal').style.display = 'block';
}

// Function to close goal modal
export function closeGoalModal() {
    document.getElementById('goalModal').style.display = 'none';
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
            location.reload(); // Reload the page
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
            snapshot.forEach(childSnapshot => {
                const goal = childSnapshot.val();
                const goalElement = document.createElement('div');
                goalElement.className = 'goal';
                goalElement.innerHTML = `
                    <h3>${goal.title}</h3>
                    <p>${goal.description}</p>
                    <p>Due Date: ${goal.dueDate}</p>
                    <p>${new Date(goal.timestamp).toLocaleString()}</p>
                    <div class="buttons">
                        <button type="button" onclick="import('./script.js').then(module => module.editGoal('${childSnapshot.key}', '${goal.title}', '${goal.description}', '${goal.dueDate}'))">
                            Edit
                        </button>
                        <button type="button" onclick="import('./script.js').then(module => module.deleteGoal('${childSnapshot.key}'))">
                            Delete
                        </button>
                    </div>
                `;
                goalsContainer.appendChild(goalElement);
            });
        } else {
            goalsContainer.innerHTML = '<p>No Goals Yet. Set One!</p>';
        }
    }).catch(error => {
        console.error('Error fetching goals:', error);
    });
}

// Function to edit goal
export function editGoal(goalKey, currentTitle, currentDescription, currentDueDate) {
    const newTitle = prompt('Enter New Title:', currentTitle);
    const newDescription = prompt('Enter New Description:', currentDescription);
    const newDueDate = prompt('Enter New Due Date:', currentDueDate);
  
    if (newTitle && newDescription && newDueDate) {
        const goalRef = ref(database, 'goals/' + goalKey);
        update(goalRef, {
            title: newTitle,
            description: newDescription,
            dueDate: newDueDate
        }).then(() => {
            alert('Goal Successfully Updated!');
            location.reload(); // Reload the page
        }).catch(error => {
            console.error('Error updating goal: ', error);
        });
    }
}

// Function to delete goal
export function deleteGoal(goalKey) {
  const confirmation = confirm('Are you sure you want to delete this goal?');
  if (confirmation) {
      const goalRef = ref(database, 'goals/' + goalKey);
      remove(goalRef).then(() => {
          alert('Goal Successfully Deleted!');
          location.reload(); // Reload the page
      }).catch(error => {
          console.error('Error deleting goal: ', error);
      });
  }
}

// Display goals when page loads
window.onload = function() {
    displayGoals();
};
