/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        gutter: 'clamp(1.25rem, 4vw, 3.75rem)',
        section: 'clamp(4rem, 8vw, 7.5rem)',
      },
      maxWidth: {
        site: '82.5rem',
      },
      colors: {
        night: 'var(--v4-night, oklch(0.192 0 0))',
        paper: 'var(--v4-paper, oklch(0.957 0.013 86.8))',
        signal: 'var(--v4-signal, oklch(0.704 0.192 47.1))',
        neutral: 'var(--v4-neutral, oklch(0.691 0.005 91.5))',
        surface: 'var(--v4-surface, oklch(0.254 0 0))',
        rokit: {
          orange: '#FF9729',
          'orange-dark': '#e6861a',
          gold: '#EC9E00',
          green: '#14AD7C',
          dark: '#1A1A1A',
          'mid-dark': '#333333',
          'dark-nav': '#444444',
          tan: '#edecdf',
          'tan-dark': '#d4d3c5',
          cream: '#FCFAF8',
          'cream-dark': '#F5F0EB',
          body: '#5e5e5e',
        },
      },
      fontFamily: {
        'v4-display': ['"Libre Baskerville"', 'Georgia', 'serif'],
        'v4-body': ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        hero: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
