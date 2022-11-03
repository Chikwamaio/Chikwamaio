/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  important: "#root",
  theme: {
    extend: {
      colors: {
        primary: '#7C067C'
      }
    },
    fontFamily:{
      sans:['Montserat','sans-serif']
    }
  },
  plugins: [],
}
