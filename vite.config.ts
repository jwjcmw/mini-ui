import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: "ui",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../dist-ui",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
