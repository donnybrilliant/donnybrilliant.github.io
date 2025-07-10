import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (
            assetInfo.fileName &&
            /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.fileName)
          ) {
            return "assets/fonts/[name].[hash][extname]";
          }
          return "assets/[name].[hash][extname]";
        },
      },
    },
  },
});
