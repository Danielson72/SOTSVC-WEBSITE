/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gold: {
          50: '#fdfbed',
          100: '#fbf5d1',
          200: '#f7e9a3',
          300: '#f2d66d',
          400: '#ecc041',
          500: '#e1a224',
          600: '#c27e1b',
          700: '#9c5d18',
          800: '#804a19',
          900: '#6b3d19',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { filter: 'brightness(100%)' },
          '100%': { filter: 'brightness(150%)' },
        },
      },
    },
  },
  plugins: [],
};