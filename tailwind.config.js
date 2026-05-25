/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#070A1A',
          purple: '#3B1D73',
          blue: '#4CC9F0',
          yellow: '#FFD166',
          healing: '#9B5DE5',
          pink: '#EF476F',
          text: '#F8F9FA',
        },
      },
      boxShadow: {
        glowBlue: '0 0 24px rgba(76, 201, 240, 0.28)',
        glowYellow: '0 0 24px rgba(255, 209, 102, 0.24)',
        glowPurple: '0 0 24px rgba(155, 93, 229, 0.26)',
        glowPink: '0 0 24px rgba(239, 71, 111, 0.24)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'cosmic-radial': 'radial-gradient(circle at top, rgba(155, 93, 229, 0.24), transparent 36%), radial-gradient(circle at 20% 20%, rgba(76, 201, 240, 0.18), transparent 24%), radial-gradient(circle at 80% 15%, rgba(239, 71, 111, 0.14), transparent 22%), radial-gradient(circle at center, rgba(255, 255, 255, 0.03), transparent 60%)',
      },
    },
  },
  plugins: [],
};
