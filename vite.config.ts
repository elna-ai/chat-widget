import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';


export default defineConfig({
  plugins: [react(),cssInjectedByJsPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      name: "@elna/chat-widget",
      fileName: "index",
      formats: ['es']
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "React-dom",
        },
      },
    },
  },
});
