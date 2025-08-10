/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        // FishandTips Brand Colors
        'primary': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#134D85', // Main Brand Blue (from logo)
          900: '#102a43',
        },
        'secondary': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#FBD874', // Brand Yellow (from logo)
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'accent': {
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
        // Additional brand colors
        'brand': {
          'blue': '#134D85',
          'yellow': '#FBD874',
          'blue-light': '#1e5a9a',
          'blue-dark': '#0f3d6b',
          'yellow-light': '#fce08a',
          'yellow-dark': '#f4c84a',
        },
      },
    },
  },
  plugins: [],
}
