/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    
    extend: {
      fontFamily: {
        primary: ["Nunito", "sans-serif"],
        secondary: ["Montserrat", "sans-serif"],
      },
      transitionDuration: {
        500: '500ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
      },
    },
  },
  plugins: [],
};
