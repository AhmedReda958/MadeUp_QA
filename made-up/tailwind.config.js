/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        // main colors
        primary: { light: "#93c5fd", DEFAULT: "#3b82f6", dark: "#1d4ed8" },
        alt: { light: "#fde68a", DEFAULT: "#fbbf24", dark: "#d97706" },
        gred: { light: "#A50AFF", DEFAULT: "#7E11BC", dark: "#640e95" },
        // for fonts
        body: { alt: "#888888", DEFAULT: "#111111" },
        secondary: { alt: "#878792", DEFAULT: "#ffffff" },
        // for background
        dark: { alt: "#242428", DEFAULT: "#000007" },
        light: { alt: "#f8f8f8", DEFAULT: "#ffffff" },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": [
          "0 35px 35px rgba(0, 0, 0, 0.5)",
          "0 45px 65px rgba(0, 0, 0, 0.3)",
        ],
      },
      fontFamily: {
        display: ["'Rubik Variable'", "sans-serif"],
        body: ["'Cairo Variable'", "sans-serif"],
        "body-play": ["'Cairo Play Variable'", "sans-serif"],
        logo: ["'Rubik Doodle Shadow'", "system-ui"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
