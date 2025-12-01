/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        danger: '#ef4444',
        success: '#22c55e',
        warning: '#f97316',
        info: '#06b6d4',
      },
    },
  },
  plugins: [],
}

