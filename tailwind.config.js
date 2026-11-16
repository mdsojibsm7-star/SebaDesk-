/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Segoe UI',
          'Noto Sans Bengali',
          'SolaimanLipi',
          'Vrinda',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        bengali: [
          'Noto Sans Bengali',
          'SolaimanLipi',
          'Kalpurush',
          'Vrinda',
          'Segoe UI',
          'sans-serif',
        ],
        serif: [
          'Georgia',
          'Cambria',
          'Times New Roman',
          'Noto Serif Bengali',
          'serif',
        ],
      },
      boxShadow: {
        'a4': '0 10px 35px -5px rgba(15, 23, 42, 0.14), 0 4px 12px -4px rgba(15, 23, 42, 0.08)',
        'studio': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};

