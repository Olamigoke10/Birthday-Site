/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream:    '#fdf8f2',
        'cream-dark': '#f7ede2',
        blush:    '#f9d5d3',
        'blush-deep': '#e8b4b8',
        rose:     '#c97b84',
        'rose-dark': '#a85965',
        gold:     '#c9a96e',
        'gold-light': '#e8d5b0',
        mauve:    '#d4a5b5',
        'mauve-light': '#f0dde6',
        ink:      '#3d2c2c',
        'ink-soft': '#7a5c60',
        'ink-muted': '#b09090',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['Jost', 'system-ui', 'sans-serif'],
      },
      animation: {
        'petal-fall': 'petalFall linear infinite',
        'spin-slow':  'spin 8s linear infinite',
        'fade-up':    'fadeUp .6s ease both',
        'scroll-line':'scrollLine 1.8s ease-in-out infinite',
      },
      keyframes: {
        petalFall: {
          '0%':   { transform: 'translateY(-40px) rotate(0deg)',           opacity: '0' },
          '10%':  { opacity: '.7' },
          '90%':  { opacity: '.5' },
          '100%': { transform: 'translateY(100vh) rotate(360deg) translateX(60px)', opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'none' },
        },
        scrollLine: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '1' },
          '50%':      { transform: 'scaleY(.5)', opacity: '.4' },
        },
      },
    },
  },
  plugins: [],
}
