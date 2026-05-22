/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
