import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/media/dist/',
  plugins: [react()],
  server: {
    allowedHosts: ['reapi.ojitos369.com']
  }
})
