import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import pluginMainfest from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pluginMainfest)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
