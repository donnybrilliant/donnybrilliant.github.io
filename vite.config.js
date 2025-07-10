import { defineConfig } from 'vite'

export default defineConfig({
  // Everything here is OPTIONAL! 
  // Vite works perfectly with an empty config: export default {}
  
  build: {
    // Optional: Remove console.log in production builds
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
})