import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Porta fixa: a API só libera CORS para http://localhost:5173 (DT-09)
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    passWithNoTests: true,
  },
});
