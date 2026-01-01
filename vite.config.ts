import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Set to repo name for GitHub Pages so assets resolve correctly
  base: '/Cuauhtemoc-Church-Site/'
});
