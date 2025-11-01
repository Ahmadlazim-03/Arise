/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#f97316',
      },
      boxShadow: {
        card: '0 10px 25px -10px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
