/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Motion system — lihat app/globals.css (MOTION SYSTEM).
    // Sengaja TIDAK ada `transition-all` / `transition-colors`: cuma transform + opacity.
    transitionProperty: {
      none: 'none',
      DEFAULT: 'opacity, transform',
      opacity: 'opacity',
      transform: 'transform',
    },
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.23, 1, 0.32, 1)', // masuk/keluar
      out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)', // pindah posisi
    },
    transitionDuration: {
      DEFAULT: '150ms',
      150: '150ms',
      200: '200ms',
      250: '250ms',
      300: '300ms', // modal (maks)
    },
    extend: {
      colors: {
        'noon-green': '#0a4d3c',
        'noon-green-light': '#1a6b56',
        'noon-gold': '#c9a961',
        'noon-gold-light': '#d4b876',
        'noon-cream': '#f3ebd9',
        'noon-cream-light': '#faf6ee',
        'noon-brown': '#8b6b3d',
        'noon-brown-dark': '#3d2817',
        'noon-rust': '#7a3d2a',
      },
      fontFamily: {
        'serif': ['Fraunces', 'serif'],
        'sans': ['DM Sans', 'system-ui', 'sans-serif'],
        'arabic': ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
