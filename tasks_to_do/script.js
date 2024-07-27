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
export function openTaskModal() {
  const modal = document.getElementById('taskModal');
  modal.style.display = 'block';
  setTimeout(() => {
      modal.querySelector('.modal-content').classList.add('show');
  }, 50);
}

// Function to close modal 
export function closeTaskModal() {
  const modal = document.getElementById('taskModal');
  modal.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => {
      modal.style.display = 'none';
  }, 300);
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
      location.reload(); 
    }).catch(error => {
      console.error('Error adding task: ', error);
    });
  } else {
    alert('Please Enter Task Title and Description.');
  }
}

// Function to display tasks
function displayTasks() {
  const taskColumns = [
    { status: 'Not Started', id: 'notStartedTasks' },
    { status: 'In Progress', id: 'inProgressTasks' },
    { status: 'Done', id: 'doneTasks' }
  ];

  // Loop through each task column
  taskColumns.forEach(column => {
    const taskList = document.getElementById(column.id);
    
    if (taskList) {
      const taskColumn = document.createElement('div');
      taskColumn.className = 'task-column';

      const heading = document.createElement('h3');
      heading.className = 'column-header';
      heading.textContent = column.status;
      taskColumn.appendChild(heading);

      taskList.appendChild(taskColumn);
    } else {
      console.error(`Task list with ID '${column.id}' not found.`);
    }
  });

  // Fetch tasks and display them within respective task lists
  const tasksRef = ref(database, 'tasks');
  get(tasksRef).then(snapshot => {
    if (snapshot.exists()) {
      const tasksArray = [];
      snapshot.forEach(childSnapshot => {
        tasksArray.push({ key: childSnapshot.key, value: childSnapshot.val() });
      });

      tasksArray.reverse();

      tasksArray.forEach(taskData => {
        const task = taskData.value;
        const status = task.status + 'Tasks';
        const taskList = document.getElementById(status);
        
        if (taskList) {
          const taskElement = document.createElement('div');
          taskElement.className = 'task';
          taskElement.addEventListener('click', () => {
              openTaskFullModal(task.title, task.description);
          });
          const taskButtons = `
            <div class="task-actions">
                <button type="button" onclick="import('./script.js').then(module => module.openEditTaskModal('${taskData.key}', '${task.title}', '${task.description}'))">
                    <i class="fas fa-edit"></i> <!-- Edit Icon -->
                </button>
                <button type="button" onclick="import('./script.js').then(module => module.deleteTask('${taskData.key}'))">
                    <i class="fas fa-trash-alt"></i> <!-- Delete Icon -->
                </button>
            </div>
          `;
          taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-datetime">${new Date(task.timestamp).toLocaleString()}</div>
                ${taskButtons}
            </div>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <div class="statusButtons">
              <button type="button" id="stat" onclick="import('./script.js').then(module => module.moveTask('${taskData.key}', 'notStarted'))">
                Not Started
              </button>
              <button type="button" id="stat" onclick="import('./script.js').then(module => module.moveTask('${taskData.key}', 'inProgress'))">
                In Progress
              </button>
              <button type="button" id="stat" onclick="import('./script.js').then(module => module.moveTask('${taskData.key}', 'done'))">
                Completed
              </button>
            </div>
          `;
          
          taskList.appendChild(taskElement);
        } else {
          console.error(`Task list with ID '${status}' not found.`);
        }
      });
    } 
  }).catch(error => {
    console.error('Error fetching tasks:', error);
  });
}

// Function to open modal with full task content
export function openTaskFullModal(title, description) {
  const modal = document.getElementById('taskFullModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalContent');

  modalTitle.textContent = title;
  modalDescription.textContent = description;

  modal.style.display = 'block';
  setTimeout(() => {
      modal.querySelector('.modal-content').classList.add('show');
  }, 50);
}

// Function to close modal 
export function closeTaskFullModal() {
  const modal = document.getElementById('taskFullModal');
  modal.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => {
      modal.style.display = 'none';
  }, 300);
}

// Function to move task to different status
export function moveTask(taskKey, newStatus) {
  const taskRef = ref(database, `tasks/${taskKey}`);
  update(taskRef, { status: newStatus })
    .then(() => {
      location.reload(); 
    })
    .catch((error) => {
      console.error('Error updating task status:', error);
    });
}


// Function to open edit task modal
export function openEditTaskModal(taskKey, currentTitle, currentContent) {
  const modal = document.getElementById('editTaskModal');
  const editTaskTitleInput = document.getElementById('editTaskTitleInput');
  const editTaskDescriptionInput = document.getElementById('editTaskDescriptionInput');

  editTaskTitleInput.value = currentTitle;
  editTaskDescriptionInput.value = currentContent;
  document.getElementById('editTaskKey').value = taskKey;

  modal.style.display = 'block';
  setTimeout(() => {
      modal.querySelector('.modal-content').classList.add('show');
  }, 50);
}

// Function to close edit task modal
export function closeEditTaskModal() {
  const modal = document.getElementById('editTaskModal');
  modal.querySelector('.modal-content').classList.remove('show');
  setTimeout(() => {
      modal.style.display = 'none';
  }, 300);
}

// Function to save edited task
export function saveEditedTask() {
  const taskKey = document.getElementById('editTaskKey').value;
  const taskTitle = document.getElementById('editTaskTitleInput').value;
  const taskDescription = document.getElementById('editTaskDescriptionInput').value;

  if (taskTitle && taskDescription) {
      const taskRef = ref(database, 'tasks/' + taskKey);
      update(taskRef, {
          title: taskTitle,
          description: taskDescription
      }).then(() => {
          alert('Task Successfully Updated!');
          closeEditTaskModal();
          location.reload();
      }).catch(error => {
          console.error('Error updating task: ', error);
      });
  } else {
      alert('Please Enter Both Task Title and Description.');
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

