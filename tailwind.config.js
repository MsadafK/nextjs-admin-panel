// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        custom: {
          500: 'var(--color-custom-500, #10b981)',
          600: 'var(--color-custom-600, #059669)',
        }
      }
    }
  },
  safelist: [
    // Patterns for all dynamic theme classes used in getThemeColors and other components
    { pattern: /(bg|text|hover:bg|ring|border|hover:border|focus:ring)-(emerald|blue|purple|orange|rose)-(50|400|500|600|700|900)/ },
    // For opacities (e.g., bg-purple-900/20 in notifications)
    { pattern: /(bg|text|hover:bg|ring|border|hover:border|focus:ring)-(emerald|blue|purple|orange|rose)-(50|400|500|600|700|900)\/(10|20|25|30|40|50|60|70|80|90)/ },
    { pattern: /(bg|text|hover:bg|ring|border|hover:border|focus:ring)-(emerald|blue|purple|orange|rose)-(50|400|500|600|700|900)\/25/ },
  ],
  plugins: [],
};