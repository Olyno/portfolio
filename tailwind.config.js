/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				ink: {
					DEFAULT: '#07080A',
					soft: '#0C0E12',
					line: '#1B1E26',
					fog: '#2A2E39'
				},
				cream: {
					DEFAULT: '#F6F1E3',
					dim: '#A8A294',
					faint: '#6B675C'
				},
				gold: {
					DEFAULT: '#E7B84F',
					soft: '#F2D38A',
					deep: '#B98A2C'
				},
				teal: {
					DEFAULT: '#2DD4BF',
					deep: '#0F766E'
				},
				duck: '#8B5CF6',
				nova: '#7C9CF5'
			},
			fontFamily: {
				display: ['Sora', 'ui-sans-serif', 'system-ui'],
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
				mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
			},
			maxWidth: {
				shell: '1200px'
			}
		}
	},
	plugins: []
};
