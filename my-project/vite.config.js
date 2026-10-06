import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: path.resolve(import.meta.dirname, 'index.html'),
        blogShell: path.resolve(import.meta.dirname, 'blog-shell.html'),
      },
    },
  },
  server: {
    proxy: Object.fromEntries(['/api', '/media', '/static', '/blog-media/', '^/blog(?:/|$|\\?)', '/sitemap.xml'].map(prefix => [prefix, { target: process.env.BACKEND_PROXY_TARGET || 'http://127.0.0.1:8000', changeOrigin: true }])),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
