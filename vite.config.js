import { defineConfig } from 'vite'

export default defineConfig({
  // Minimal config - Vite handles fonts automatically
  build: {
    // Optional: Clean console logs in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
})