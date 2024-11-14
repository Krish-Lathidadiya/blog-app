import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: 'http://localhost:5000/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/server/, ''), // Remove '/server' prefix
      },
    },
  },
  plugins: [react()],
});
