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
        'glow-primary': '0 0 25px -4px rgba(99, 102, 241, 0.4)',
        'glow-sky': '0 0 25px -4px rgba(14, 165, 233, 0.4)',
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.06)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2.5s infinite ease-in-out',
        'float': 'float 3.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
    },
  },
  plugins: [],
};
