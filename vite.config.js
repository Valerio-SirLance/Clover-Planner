import { defineConfig } from 'vite';
import { resolve } from 'path';
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';
import copy from 'rollup-plugin-copy';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'home/home.html'),
        goals: resolve(__dirname, 'goals/goals.html'),
        freedomWall: resolve(__dirname, 'freedom_wall/freedom-wall.html'),
        smallWins: resolve(__dirname, 'small_wins/small-wins.html'),
        taskToDo: resolve(__dirname, 'tasks_to_do/task-to-do.html')
      },
      output: {
        assetFileNames: '[name][extname]',
      },
      plugins: [
        replace({
          preventAssignment: true,
          values: {
            'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
            'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN),
            'import.meta.env.VITE_FIREBASE_DATABASE_URL': JSON.stringify(process.env.VITE_FIREBASE_DATABASE_URL),
            'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID),
            'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET),
            'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
            'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_FIREBASE_APP_ID)
          }
        }),
        copy({
          targets: [
            { src: 'home/script.js', dest: 'dist/home' },
            { src: 'goals/script.js', dest: 'dist/goals' },
            { src: 'freedom_wall/script.js', dest: 'dist/freedom_wall' },
            { src: 'small_wins/script.js', dest: 'dist/small_wins' },
            { src: 'tasks_to_do/script.js', dest: 'dist/tasks_to_do' }
          ],
          hook: 'writeBundle'
        })
      ]
    }
  },
});
