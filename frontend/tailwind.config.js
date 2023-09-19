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
        "near-black": "#212427",
        "near-white": "#f5f5fa",
        "custom-secondary": "#119abf",
        contrast: "#ff6b6b",
        accent: "#2ecc71",
        "neutral-light": "#f8f9fa",
        "neutral-dark": "#343a40",
        "custom-primary": "#00BDD6",
        "custom-secondary": "#8353E2",
        color3: "#4069E5",
        color4: "#ED7D2D",
        danger: "#DE3B40",
        warning: "#EFB034",
        success: "#1DD75B",
        info: "#379AE6",
        "lighter-background": "#282828",
        "background-color": "#161616",
        "container-background-color": "#171A1FFF",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("flowbite-typography")],
};