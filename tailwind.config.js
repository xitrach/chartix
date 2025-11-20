/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Classic Gold
          hover: '#B5952F',
          glow: 'rgba(212, 175, 55, 0.5)'
        },
        secondary: {
          DEFAULT: '#C0C0C0', // Silver
          hover: '#A9A9A9',
        },
        dark: {
          950: '#050505', // Deep Black
          900: '#0A0A0A', // Rich Black
          800: '#121212', // Soft Black
          card: 'rgba(18, 18, 18, 0.8)',
        },
        accent: {
          gold: '#FFD700',
          silver: '#E5E4E2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Noto Kufi Arabic', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
