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
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
