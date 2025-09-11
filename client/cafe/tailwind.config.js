/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a3a2f',
        secondary: '#10B981',
        accent: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}