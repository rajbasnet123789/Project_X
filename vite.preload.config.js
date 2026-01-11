import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: ".vite/preload",
    lib: {
      entry: "./src/preload.js",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["electron"]
    }
  }
});
