import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        fontFamily: {
            'almarai': ['Almarai', 'sans-serif'],
            'elmessiri': ['El Messiri', 'sans-serif'],
        },
        animation: {
            'border': 'border 4s linear infinite',
        },
        keyframes: {
            'border': {
                to: { '--border-angle': '360deg' },
            }
        }                      
    },
},
  plugins: [daisyui],
};
