import { defineConfig } from 'vite'

export default defineConfig({
  // CSS optimization
  css: {
    devSourcemap: true,
    postcss: {
      plugins: []
    }
  },
  
  // Build optimization
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Organize font files
          if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        }
      }
    },
    // Font optimization
    assetsInlineLimit: 0, // Don't inline fonts - keep them separate for better caching
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Development server
  server: {
    hmr: {
      overlay: false
    }
  },
  
  // Dependency optimization 
  optimizeDeps: {
    exclude: [
      '@fontsource/dosis',
      '@fontsource/silkscreen'
    ]
  }
})