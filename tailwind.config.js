// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      /* ── Font ── */
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },

      /* ── shadCN CSS-variable colors ── */
      colors: {
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',

        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        /* Legacy dynamic theme support — keep for ThemeContext compatibility */
        custom: {
          500: 'var(--color-custom-500, #10b981)',
          600: 'var(--color-custom-600, #059669)',
        },
      },

      /* ── Border Radius ── */
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      /* ── Spacing scale (no overrides — Tailwind default is the shadCN scale) ── */

      /* ── Box Shadow — minimal, border-first ── */
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        dropdown: '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        modal: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
      },

      /* ── Transitions ── */
      transitionDuration: {
        DEFAULT: '150ms',
      },

      /* ── Sidebar width tokens ── */
      width: {
        sidebar:           '16rem',   /* 256px */
        'sidebar-collapsed': '4rem',  /* 64px  */
      },

      /* ── Navbar height ── */
      height: {
        navbar: '4rem', /* 64px */
      },
    },
  },

  safelist: [
    /* Dynamic theme classes used by ThemeContext.getThemeColors() */
    {
      pattern:
        /(bg|text|hover:bg|ring|border|hover:border|focus:ring)-(emerald|blue|purple|orange|rose)-(50|400|500|600|700|900)/,
    },
    {
      pattern:
        /(bg|text|hover:bg|ring|border|hover:border|focus:ring)-(emerald|blue|purple|orange|rose)-(50|400|500|600|700|900)\/(10|20|25|30|40|50|60|70|80|90)/,
    },
    /* Dark mode sidebar/navbar variants */
    { pattern: /(bg|text|border)-(zinc|gray)-(50|100|200|300|400|500|600|700|800|900|950)/ },
  ],

  plugins: [],
};