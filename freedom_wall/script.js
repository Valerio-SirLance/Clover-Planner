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

// Function to open note modal
export function openNoteModal() {
    document.getElementById('noteModal').style.display = 'block';
  }

// Function to clpse note modal
export function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
  }

// Function to save note
export function saveNote() {
    const noteTitle = document.getElementById('noteTitleInput').value;
    const noteContent = document.getElementById('noteContentInput').value;
    
    if (noteTitle && noteContent) {
        const notesRef = ref(database, 'freedomWall');
        const newNoteRef = push(notesRef);
        const timestamp = Date.now();
        set(newNoteRef, {
            title: noteTitle,
            content: noteContent,
            timestamp: timestamp
        }).then(() => {
            alert('Note Successfully Added!');
            closeNoteModal();
            location.reload();
        }).catch(error => {
            console.error('Error adding note: ', error);
        });
    } else {
        alert('Please Enter Both Note Title and Content.');
    }
}
  
// Function to display notes
function displayNotes() {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    const notesRef = ref(database, 'freedomWall');
    get(notesRef).then(snapshot => {
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const note = childSnapshot.val();
                const noteElement = document.createElement('div');
                noteElement.classList.add('note'); 
                noteElement.innerHTML = `
                    <div class="note-header">
                        <div class="note-datetime">${new Date(note.timestamp).toLocaleString()}</div>
                        <div class="note-actions">
                            <button type="button" onclick="import('./script.js').then(module => module.editNote('${childSnapshot.key}', '${note.title}', '${note.content}'))">
                                <i class="fas fa-edit"></i> <!-- Edit Icon -->
                            </button>
                            <button type="button" onclick="import('./script.js').then(module => module.deleteNote('${childSnapshot.key}'))">
                                <i class="fas fa-trash-alt"></i> <!-- Delete Icon -->
                            </button>
                        </div>
                    </div>
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                `;
                notesContainer.appendChild(noteElement);
            });
        } else {
            notesContainer.innerHTML = '<p class="empty">No Notes Yet. Create One!</p>';
        }
    }).catch(error => {
        console.error('Error fetching notes:', error);
    });
}

// Function to edit note
export function editNote(noteKey, currentTitle, currentContent) {
    const newTitle = prompt('Enter New Title:', currentTitle);
    const newContent = prompt('Enter New Content:', currentContent);
  
    if (newTitle && newContent) {
        const noteRef = ref(database, 'freedomWall/' + noteKey);
        update(noteRef, {
            title: newTitle,
            content: newContent
        }).then(() => {
            alert('Note Successfully Updated!');
            location.reload(); 
        }).catch(error => {
            console.error('Error updating note: ', error);
        });
    }
}

// Function to delete note
export function deleteNote(noteKey) {
  const confirmation = confirm('Are you sure you want to delete this note?');
  if (confirmation) {
      const noteRef = ref(database, 'freedomWall/' + noteKey);
      remove(noteRef).then(() => {
          alert('Note Successfully Deleted!');
          location.reload(); 
      }).catch(error => {
          console.error('Error deleting note: ', error);
      });
  }
}

// Display notes when page loads
window.onload = function() {
    displayNotes();
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

  