import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        ivory: '#FAF6F7',
        ink: '#24141E',
        muted: '#7A646E',
        rose: { DEFAULT: '#B82A54', deep: '#871D3F' },
        plum: { DEFAULT: '#5C0F2E', soft: '#F8EEF1', dark: '#3D071D' },
        coral: { DEFAULT: '#630D2B', hover: '#4A081E' },
        burgundy: '#50061C',
        blush: { DEFAULT: '#F7DDE3', soft: '#FFF5F6' },
        gold: { DEFAULT: '#C59B56', deep: '#A67C39', soft: '#FDF7EE' },
        sky: { DEFAULT: '#8FC1D4', soft: '#E8F3F8' },
        line: '#EFE3E6',
        ok: '#26734E',
        warn: '#B7791F',
        bad: '#B42318',
      },
      fontFamily: {
        serif: ['"Playfair Display Variable"', '"Fraunces Variable"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(92,15,46,.06), 0 14px 28px -10px rgba(92,15,46,.08)',
        luxury: '0 10px 30px -10px rgba(92,15,46,0.12)',
      },
      borderRadius: { card: '16px' },
    },
  },
  plugins: [],
} satisfies Config;
