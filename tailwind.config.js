/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Roboto', 'ui-sans-serif', 'system-ui']
		},
		extend: {
			colors: {
				primary: '#113946',
				secondary: '#BCA37F',
				background: '#FFF2D8',
				highlight: '#EAD7BB'
			}
		}
	},
	plugins: []
};
