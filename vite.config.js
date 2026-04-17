import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  preview: {
    allowedHosts: [
      'compassionate-flexibility-production-b8b0.up.railway.app',
      '*.up.railway.app',
      'localhost',
      '127.0.0.1',
    ],
  },
})
