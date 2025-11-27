/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Colors for map markers and categories
    "bg-blue-100",
    "bg-blue-500",
    "bg-blue-700",
    "text-blue-500",
    "text-blue-700",
    "bg-purple-100",
    "bg-purple-500",
    "bg-purple-700",
    "text-purple-500",
    "text-purple-700",
    "bg-green-100",
    "bg-green-500",
    "bg-green-700",
    "text-green-500",
    "text-green-700",
    "bg-yellow-100",
    "bg-yellow-500",
    "bg-yellow-700",
    "text-yellow-500",
    "text-yellow-700",
    "bg-red-100",
    "bg-red-500",
    "bg-red-700",
    "text-red-500",
    "text-red-700",
    "bg-gray-100",
    "bg-gray-500",
    "bg-gray-700",
    "text-gray-500",
    "text-gray-700",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Red/Burgundy (DFSA Platform)
        primary: {
          DEFAULT: "#9b1823",
          dark: "#7a1219",
          light: "#c5505c",
          50: '#fef2f2',
          100: '#fee2e2',
          600: '#9b1823',
          700: '#7a1219',
          800: '#621015',
          900: '#4a0c10',
        },
        // DFSA Secondary - Gold
        'dfsa-gold': {
          DEFAULT: '#A39161',
          50: '#f9f7f1',
          100: '#f3efe3',
          500: '#b5a273',
          600: '#A39161',
          700: '#8a7a51',
          800: '#6f6241',
        },
        // DFSA Accent - Teal
        'dfsa-teal': {
          DEFAULT: '#0891B2',
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
        },
        // Keep existing teal for backward compatibility
        teal: {
          DEFAULT: "#00E5D1",
          dark: "#00665C",
          light: "#99FFF5",
        },
        // Keep existing purple for backward compatibility
        purple: {
          DEFAULT: "#954BF9",
          dark: "#4F2E80",
          light: "#C499FF",
        },
      },
      fontFamily: {
        display: ['Crimson Pro', 'Georgia', 'serif'],
        heading: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Crimson Pro', 'Georgia', 'serif'],
      },
      zIndex: {
        400: 400,
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
