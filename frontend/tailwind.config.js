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
        ember: {
          bg: '#0A0A0A',
          sidebar: '#0D0D0D',
          card: '#121212',
          elevated: '#161616',
        },
        royal: {
          navy: '#0A0A0A',
          elevated: '#121212',
          interactive: '#181818',
          gold: '#E5E5E5',
          goldLight: '#FFFFFF',
          purple: '#262626',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        royal: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
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
