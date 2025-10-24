/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../new project/components/**/*.{js,ts,jsx,tsx}",
    "../../new project/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5f6FFF'
    },
    gridTemplateColumns: {
      'auto': 'repeat(auto-fill, minmax(200px, 1fr))',
    }
  },
},
  plugins: [],
}