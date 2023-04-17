/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#3aa5a9",
        light: "#d2d9d9",
        dark: "#17252A",
        gray: "#5f6666"
      }
    },
  },
  plugins: [],
}

