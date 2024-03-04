const pluginMainfest = {
  name: "MadeUp",
  short_name: "MadeUp",
  start_url: "/login",
  display: "standalone",
  description: "",
  lang: "en",
  dir: "auto",
  theme_color: "#3b82f6",
  background_color: "#ffffff",
  orientation: "any",
  icons: [
    {
      src: "public/icons/manifest-icon-192.maskable.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "public/icons/manifest-icon-192.maskable.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "public/icons/manifest-icon-512.maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "public/icons/manifest-icon-512.maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
  screenshots: [
    {
      src: "https://www.pwabuilder.com/assets/screenshots/screen1.png",
      sizes: "2880x1800",
      type: "image/png",
      description: "A screenshot of the home page",
    },
  ],
  related_applications: [
    {
      platform: "windows",
      url: " The URL to your app in that app store",
    },
  ],
  prefer_related_applications: false,
  shortcuts: [
    {
      name: "MadeUp",
      url: "/login",
      description: "",
    },
  ],
};

export default pluginMainfest;
