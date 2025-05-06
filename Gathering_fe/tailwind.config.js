// export default {
//   content: [
//     './index.html',
//     './src/**/*.{js,ts,jsx,tsx}',
//     './node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}'
//   ],
//   theme: {
//     extend: {}
//   },
//   plugins: [require('tailwindcss-font-inter')]
// };

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif']
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: [require('tailwind-scrollbar-hide')]
};
