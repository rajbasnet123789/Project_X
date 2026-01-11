import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: ".vite/main",
    lib: {
      entry: "./src/main.js",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["electron"]
    }
  }
});
