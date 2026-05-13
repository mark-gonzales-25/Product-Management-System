/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2744',
          2: '#243057',
        },
        purple: {
          DEFAULT: '#6c5ce7',
          2: '#a29bfe',
          light: '#f0eeff',
        },
        'app-green': '#00b894',
        'app-red': '#d63031',
        'app-amber': '#fdcb6e',
        'app-blue': '#0984e3',
        'app-bg': '#f4f5f9',
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
