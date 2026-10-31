/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          navy: '#050914',
          sapphire: '#0B1224',
          elevated: '#101A33',
          interactive: '#162344',
          gold: '#D4AF37',
          goldLight: '#F5D061',
          goldDark: '#B48811',
          blue: '#1D4ED8',
          white: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        royal: ['"Playfair Display"', '"Plus Jakarta Sans"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'spring-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        micro: '180ms',
        component: '360ms',
        section: '480ms',
      },
    },
  },
  plugins: [],
};
