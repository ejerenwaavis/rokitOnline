/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
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

