/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        nova: {
          bg: '#04080F',
          surface: {
            1: '#0A1020',
            2: '#0F182B',
            3: '#1A2540',
          },
          purple: {
            DEFAULT: '#7C3AED',
            dark: '#4C1D95',
            light: '#A78BFA',
            xl: '#C4B5FD',
          },
          text: {
            1: '#FFFFFF',
            2: '#7A8BA8',
            3: '#2D3D58',
          },
          success: '#10B981',
          error:   '#F43F5E',
          warning: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};