/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F3EC',
        card: '#FFFDF8',
        forest: '#0B2318',
        brand: {
          DEFAULT: '#00A97A',
          dark: '#00805C',
          light: '#DCF3EA'
        },
        quiet: {
          DEFAULT: '#F59E0B',
          light: '#FDF0DA'
        },
        lost: {
          DEFAULT: '#C45A25',
          light: '#F6E4D8'
        },
        wa: {
          DEFAULT: '#25D366',
          dark: '#075E54'
        },
        ink: '#16211C',
        muted: '#68766E',
        line: '#E7E1D3'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      borderRadius: {
        card: '20px',
        pill: '999px'
      }
    }
  },
  plugins: []
}
