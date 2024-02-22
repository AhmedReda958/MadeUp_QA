/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // main colors
        primary: { light: "#370aff", DEFAULT: "#3011BC", dark: "#270e95" },
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
    },
  },
  plugins: [],
};
