/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#db0a5b",
        lightGray: "#f9f9f9",
        darkGray: "#333333",
      },
    },
  },
  plugins: [],
}

