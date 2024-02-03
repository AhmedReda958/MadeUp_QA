/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // main colors
        primary: { light: "#67e8f9", DEFAULT: "#06b6d4", dark: "#0e7490" },
        alt: { light: "#fde68a", DEFAULT: "#fbbf24", dark: "#d97706" },
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
    },
  },
  plugins: [],
};
