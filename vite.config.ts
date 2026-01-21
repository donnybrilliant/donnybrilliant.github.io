import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification and tree-shaking
    minify: "esbuild",
    target: "esnext",
    // Generate hidden source maps for debugging (not exposed to users)
    sourcemap: "hidden",
    // Split chunks for better caching and smaller initial load
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-icons": ["@iconify/react"],
          "vendor-avataaars": ["@vierweb/avataaars"],
        },
      },
    },
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "@iconify/react",
      "@tanstack/react-query",
    ],
  },
});
