const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const scripts = {
  main: 'script.js', 
  home: 'home/script.js',
  goals: 'goals/script.js',
  freedom_wall: 'freedom_wall/script.js',
  small_wins: 'small_wins/script.js',
  tasks_to_do: 'tasks_to_do/script.js'
};

const outputDir = 'dist';

// Function to replace environment variables in files
function replaceEnvVariables(content) {
  return content
    .replace(/import\.meta\.env\.VITE_FIREBASE_API_KEY/g, JSON.stringify(process.env.VITE_FIREBASE_API_KEY))
    .replace(/import\.meta\.env\.VITE_FIREBASE_AUTH_DOMAIN/g, JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN))
    .replace(/import\.meta\.env\.VITE_FIREBASE_DATABASE_URL/g, JSON.stringify(process.env.VITE_FIREBASE_DATABASE_URL))
    .replace(/import\.meta\.env\.VITE_FIREBASE_PROJECT_ID/g, JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID))
    .replace(/import\.meta\.env\.VITE_FIREBASE_STORAGE_BUCKET/g, JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET))
    .replace(/import\.meta\.env\.VITE_FIREBASE_MESSAGING_SENDER_ID/g, JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID))
    .replace(/import\.meta\.env\.VITE_FIREBASE_APP_ID/g, JSON.stringify(process.env.VITE_FIREBASE_APP_ID));
}

// Read, replace and copy files
Object.keys(scripts).forEach(key => {
  const srcPath = path.resolve(__dirname, scripts[key]);
  
  const destPath = key === 'main' 
    ? path.resolve(__dirname, outputDir, 'script.js') 
    : path.resolve(__dirname, outputDir, key, 'script.js'); 

  fs.ensureDirSync(path.dirname(destPath));

  fs.readFile(srcPath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${srcPath}: ${err}`);
      return;
    }
    const result = replaceEnvVariables(data);
    fs.writeFile(destPath, result, 'utf8', err => {
      if (err) {
        console.error(`Error writing file ${destPath}: ${err}`);
      }
    });
  });
});
