import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Stopwatch-Timer-UIHackaton/', 
  build: {
    terserOptions: {
      parse: {
        ecma: 2020
      }
    }
  }
});