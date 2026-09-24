import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  server: {
    proxy: Object.fromEntries(['/api', '/media', '/admin', '/static'].map(prefix => [prefix, { target: process.env.BACKEND_PROXY_TARGET || 'http://127.0.0.1:8000', changeOrigin: true }])),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
