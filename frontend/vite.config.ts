import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // Change this URL if your port 8000 address is different in the Ports tab
        target: 'https://stunning-space-waddle-wrp4wxpqq5rc54r7-8000.app.github.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})