/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  safelist: ['font-raleway'], // prevents purge
  theme: {
    extend: {
      fontFamily: {
        raleway: ['raleway', 'sans-serif'], // 👈 enables font-raleway
      },
    },
  },
  plugins: [],
};
