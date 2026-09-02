/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#F5F5F5',
        success: '#4CAF50',
        danger: '#F44336',
        warning: '#FF9800',
      },
    },
  },
  plugins: [],
};