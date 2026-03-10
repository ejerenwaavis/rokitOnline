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
          dark: '#222222',
          'mid-dark': '#333333',
          'dark-nav': '#444444',
          tan: '#edecdf',
          'tan-dark': '#d4d3c5',
          body: '#777777',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
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

