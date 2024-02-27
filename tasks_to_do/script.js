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

// Function to open task modal
export function openTaskModal() {
  document.getElementById('taskModal').style.display = 'block';
}

// Function to close task modal
export function closeTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
}
// Function to add task
export function addTask() {
  const taskTitle = document.getElementById('taskTitleInput').value;
  const taskDescription = document.getElementById('taskDescriptionInput').value;

  if (taskTitle && taskDescription) {
    const tasksRef = ref(database, 'tasks');
    const newTaskRef = push(tasksRef);

    set(newTaskRef, {
      title: taskTitle,
      description: taskDescription,
      status: 'notStarted',
      timestamp: new Date().getTime()
    }).then(() => {
      alert('Task Successfully Added!');
      closeTaskModal();
      location.reload(); // Reload the page
    }).catch(error => {
      console.error('Error adding task: ', error);
    });
  } else {
    alert('Please Enter Task Title and Description.');
  }
}

// Function to display tasks
function displayTasks() {
  const notStartedTasks = document.getElementById('notStartedTasks');
  const inProgressTasks = document.getElementById('inProgressTasks');
  const doneTasks = document.getElementById('doneTasks');

  const tasksRef = ref(database, 'tasks');
  get(tasksRef).then(snapshot => {
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const task = childSnapshot.val();
        const taskElement = document.createElement('div');
        taskElement.innerHTML = `
          <p>${task.title}</p>
          <p>${task.description}</p>
          <p>${new Date(task.timestamp).toLocaleString()}</p>
          <button type="button" onclick="import('./script.js').then(module => module.moveTask('${childSnapshot.key}', 'inProgress'))">
            Start
          </button>
          <button type="button" onclick="import('./script.js').then(module => module.moveTask('${childSnapshot.key}', 'done'))">
            Complete
          </button>
          <button type="button" onclick="import('./script.js').then(module => module.editTask('${childSnapshot.key}', '${task.title}', '${task.description}'))">
            Edit
          </button>
          <button type="button" onclick="import('./script.js').then(module => module.deleteTask('${childSnapshot.key}'))">
            Delete
          </button>
        `;

        if (task.status === 'notStarted') {
          notStartedTasks.appendChild(taskElement);
          notStartedTasks.querySelector('p').style.display = 'none'; 
        } else if (task.status === 'inProgress') {
          inProgressTasks.appendChild(taskElement);
          inProgressTasks.querySelector('p').style.display = 'none'; 
        } else if (task.status === 'done') {
          doneTasks.appendChild(taskElement);
          doneTasks.querySelector('p').style.display = 'none'; 
        }
      });
    } else {
      // Show "No Tasks Here" message when there are no tasks in each column
      notStartedTasks.querySelector('p').style.display = 'block';
      inProgressTasks.querySelector('p').style.display = 'block';
      doneTasks.querySelector('p').style.display = 'block';
    }
  }).catch(error => {
    console.error('Error fetching tasks:', error);
  });
}

// Function to move task to different status
export function moveTask(taskKey, newStatus) {
  const taskRef = ref(database, `tasks/${taskKey}`);
  update(taskRef, { status: newStatus })
    .then(() => {
      console.log('Task status updated successfully!');
      location.reload(); 
    })
    .catch((error) => {
      console.error('Error updating task status:', error);
    });
}

// Function to edit task
export function editTask(taskKey, currentTitle, currentDescription) {
  const newTitle = prompt('Enter New Title:', currentTitle);
  const newDescription = prompt('Enter New Description:', currentDescription);

  if (newTitle && newDescription) {
    const taskRef = ref(database, `tasks/${taskKey}`);
    update(taskRef, {
      title: newTitle,
      description: newDescription
    }).then(() => {
      alert('Task Successfully Updated!');
      location.reload(); 
    }).catch(error => {
      console.error('Error updating task: ', error);
    });
  }
}

// Function to delete task
export function deleteTask(taskKey) {
  const confirmation = confirm('Are you sure you want to delete this task?');
  if (confirmation) {
    const taskRef = ref(database, 'tasks/' + taskKey);
    remove(taskRef)
      .then(() => {
        alert('Task Successfully Deleted!');
        location.reload();
      })
      .catch(error => {
        console.error('Error deleting task: ', error);
      });
  }
}

// Display tasks when page loads
window.onload = function() {
  displayTasks();
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

