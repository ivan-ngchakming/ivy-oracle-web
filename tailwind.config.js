/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      "display": ["Noto Sans", "sans-serif"],
      "body": ["Noto Sans", "sans-serif"],
    },
    extend: {},
  },
  plugins: []
}
