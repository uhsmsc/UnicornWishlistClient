import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // клиентский порт
    proxy: {
      "/api": {
        target: "http://localhost:3000", // сервер работает на порту 3000
        changeOrigin: true,
      },
    },
    allowedHosts: ["ed5954eb283dc9eedab6866e33382a1d.serveo.net"],
  },
  resolve: {
    alias: {
      "@dubaua/get-declension":
        "@dubaua/get-declension/dist/get-declension.min.mjs",
    },
  },
});
