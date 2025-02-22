import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '880px', // Define a custom breakpoint
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        spin: 'spin 1.2s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-down': 'fadeInDown 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#eab308',
          light: '#fde047',
          dark: '#ca8a04',
        },
        secondary: {
          DEFAULT: '#fef9c3',
          dark: '#fef08a',
        },
        background: 'var(--background)',
        text: 'var(--text)',
        yellow: {
          400: '#fde047',
          500: '#facc15',
          600: '#eab308',
          700: '#ca8a04',
        },
      }
    },
  },
  plugins: [],
};

export default config;