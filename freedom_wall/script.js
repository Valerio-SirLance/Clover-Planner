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
export function openNoteModal() {
    const modal = document.getElementById('noteModal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 50);
}

// Function to close modal 
export function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
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
            const notesArray = [];
            snapshot.forEach(childSnapshot => {
                notesArray.push({ key: childSnapshot.key, value: childSnapshot.val() });
            });

            notesArray.reverse();

            notesArray.forEach(noteData => {
                const note = noteData.value;
                const noteElement = document.createElement('div');
                noteElement.classList.add('note'); 
                noteElement.addEventListener('click', () => {
                    openNoteFullModal(note.title, note.content);
                });
                noteElement.innerHTML = `
                    <div class="note-header">
                        <div class="note-datetime">${new Date(note.timestamp).toLocaleString()}</div>
                        <div class="note-actions">
                            <button type="button" onclick="import('./script.js').then(module => module.openEditNoteModal('${noteData.key}', '${note.title}', '${note.content}'))">
                                <i class="fas fa-edit"></i> <!-- Edit Icon -->
                            </button>
                            <button type="button" onclick="import('./script.js').then(module => module.deleteNote('${noteData.key}'))">
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

// Function to open modal with full note content
export function openNoteFullModal(title, content) {
    const modal = document.getElementById('noteFullModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    modalTitle.textContent = title;
    modalContent.textContent = content;

    modal.style.display = 'block';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 50);
}

// Function to close modal 
export function closeNoteFullModal() {
    const modal = document.getElementById('noteFullModal');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Function to open edit note modal
export function openEditNoteModal(noteKey, currentTitle, currentContent) {
    const modal = document.getElementById('editNoteModal');
    const editNoteTitleInput = document.getElementById('editNoteTitleInput');
    const editNoteContentInput = document.getElementById('editNoteContentInput');
  
    editNoteTitleInput.value = currentTitle;
    editNoteContentInput.value = currentContent;
    document.getElementById('editNoteKey').value = noteKey;
  
    modal.style.display = 'block';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 50);
}

// Function to close edit note modal
export function closeEditNoteModal() {
    const modal = document.getElementById('editNoteModal');
    modal.querySelector('.modal-content').classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Function to save edited note
export function saveEditedNote() {
    const noteKey = document.getElementById('editNoteKey').value;
    const noteTitle = document.getElementById('editNoteTitleInput').value;
    const noteContent = document.getElementById('editNoteContentInput').value;
  
    if (noteTitle && noteContent) {
        const noteRef = ref(database, 'freedomWall/' + noteKey);
        update(noteRef, {
            title: noteTitle,
            content: noteContent
        }).then(() => {
            alert('Note Successfully Updated!');
            closeEditNoteModal();
            location.reload();
        }).catch(error => {
            console.error('Error updating note: ', error);
        });
    } else {
        alert('Please Enter Both Note Title and Content.');
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

  