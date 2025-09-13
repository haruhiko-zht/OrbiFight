import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'process';

// Prefer Vite env for API base; fallback to localhost:40103 (APP_PORT in root .env.example)
const apiBase: string = process.env.VITE_API_BASE || 'http://localhost:40103';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  define: { __API__: JSON.stringify(apiBase) },
});
