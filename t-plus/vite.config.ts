import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api/academic": {
        target: `${process.env.VITE_API_BASE_ACADEMIC}/JIS/prtData/bySamples`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/academic/, ""),
      },
      "/api/novosverdlovskaya": {
        target: `${process.env.VITE_API_BASE_NOVOSVERDLOVSKAYA}/JIS/prtData/bySamples`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/novosverdlovskaya/, ""),
      },
      "/commands/novosverdlovskaya": {
        target: `${process.env.VITE_API_BASE_NOVOSVERDLOVSKAYA}/JIS/commands`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/commands\/novosverdlovskaya/, ""),
      },
      "/commands/academic": {
        target: `${process.env.VITE_API_BASE_ACADEMIC}/JIS/commands`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/commands\/academic/, ""),
      },
      "/authorization": {
        target: `${process.env.VITE_API_BASE_ACADEMIC}/JIS/users/login`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/authorization/, ""),
      },
    },
  },
});
