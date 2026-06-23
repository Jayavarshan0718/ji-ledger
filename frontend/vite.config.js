import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isGHPages = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  base: isGHPages ? "/ji-ledger/" : "/",
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/uploads": "http://127.0.0.1:8000",
    },
  },
  build: {
    outDir: "build",
  },
});
