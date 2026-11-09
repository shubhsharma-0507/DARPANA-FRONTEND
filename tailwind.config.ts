import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        ivory: '#FFF7F8', ink: '#2A1620', muted: '#7A5F69', rose: { DEFAULT: '#D1486E', deep: '#B0305A' },
        plum: { DEFAULT: '#5C0F2E', soft: '#FDECEF' }, coral: { DEFAULT: '#BB1042', hover: '#9A0D36' },
        burgundy: '#50061C', blush: { DEFAULT: '#FDD0D4', soft: '#FFE9EC' }, gold: { DEFAULT: '#EABE81', deep: '#C99A55' },
        sky: { DEFAULT: '#8FC1D4', soft: '#E8F3F8' },
        line: '#F1D9DD', ok: '#2F7D5B', warn: '#B7791F', bad: '#B42318',
      },
      fontFamily: { serif: ['"Playfair Display Variable"', 'Georgia', 'serif'], script: ['"Great Vibes"', 'cursive'], sans: ['"Inter Variable"', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(92,15,46,.06), 0 10px 28px -14px rgba(92,15,46,.18)' },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
} satisfies Config;
