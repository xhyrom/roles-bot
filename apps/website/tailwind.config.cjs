/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				dark: "#111111",
			},
			fontFamily: {
				body: ["Montserrat", "sans-serif"],
			},
		},
	},
	plugins: [],
};
