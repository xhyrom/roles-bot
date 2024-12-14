/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        dark: "#111111",
        "dark-100": "#1A1A1A",
        blue: "#5865F2",
        gold: "#FFA500",
      },
      fontFamily: {
        body: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
