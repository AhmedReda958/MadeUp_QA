import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifest = {
  name: "MadeUp",
  short_name: "MadeUp",
  start_url: ".",
  display: "standalone",
  background_color: "#ffffff",
  lang: "en",
  scope: "/",
  icons: [
    {
      src: "/icons/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/icons/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  theme_color: "#3b82f6",
  id: "/",
  description: "Send and anwser Anonymous messages",
  dir: "auto",
  orientation: "portrait-primary",
  categories: ["entertainment", "social"],
  shortcuts: [
    { name: "Home", url: "/", description: "" },
    { name: "Messages", url: "/messages", description: "" },
  ],
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest,
      workbox: {
        globPatterns: [
          "assets/*",
          "img/*",
          "icons/*",
          "assets/*",
          // add HTML and other resources for the root directory
          "*.{svg,png,jpg,jpeg}",
          "*.html",
          "manifest.webmanifest",
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
