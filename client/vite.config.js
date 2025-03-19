import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  optimizeDeps: {
    include: ['ol'],
  },
  build: {
    rollupOptions: {
      external: ['ol'],
    },
  plugins: [react()],
  }
})
