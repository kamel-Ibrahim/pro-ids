import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // IMPORTANT: Go to the "Ports" tab in VS Code and copy the "Forwarded Address" for port 8000
        target: 'https://stunning-space-waddle-wrp4wxpqq5rc54r7-8000.app.github.dev',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Remove this if your Laravel routes start with /api
      }
    }
  }
})