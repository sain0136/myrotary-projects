/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral Colors
        nearBlack: "#212427",
        nearWhite: "#f5f5fa",
        neutralLight: "#f8f9fa",
        neutralDark: "#343a40",
        // Background Color
        background: "#f5f5fa",
        // Primary Colors
        primary: "#FFB607",
        primaryNearBlack: "#212427",
        primaryHover: "#FFA200",
        primaryFocus: "#FFC833",
        primaryNearBlackHover: "#3A3E44",
        primaryNearBlackFocus: "#53575D",

        // Secondary Colors
        secondary: "#72A900",
        secondaryHover: "#8dbd00",
        secondaryFocus: "#a8d100",
        contrast: "#2F4858",
        // Error and Success Colors
        danger: "#DE3B40",
        warning: "#EFB034",
        success: "#1DD75B",
        info: "#379AE6",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("flowbite-typography")],
};
