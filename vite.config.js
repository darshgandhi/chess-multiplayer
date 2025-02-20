import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true, // Ensures source maps are generated
  },
  server: {
    allowedHosts: [
      "2b08-2607-fea8-a22-3900-6c6a-8c31-5ee-1908.ngrok-free.app",
      "8990-2607-fea8-a22-3900-6c6a-8c31-5ee-1908.ngrok-free.app",
      "a95c-2607-fea8-a22-3900-6c6a-8c31-5ee-1908.ngrok-free.app",
      'localhost'
    ],
    host: '0.0.0.0'
  },
});
