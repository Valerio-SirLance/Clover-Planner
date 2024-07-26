import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'home/home.html',
        goals: 'goals/goals.html',
        freedomWall: 'freedom_wall/freedom-wall.html',
        smallWins: 'small_wins/small-wins.html',
        taskToDo: 'tasks_to_do/task-to-do.html'
      }
    }
  }
});
