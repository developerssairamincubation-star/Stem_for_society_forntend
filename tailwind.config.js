/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			// SFS UI design tokens (see src/sfs/styles/sfs-ui.css)
			colors: {
				brand: '#0389ff',
				deep: '#00549f',
				tint: '#c0e1ff',
				ink: '#111827',
				surface: '#f2f8ff',
			},
			borderRadius: {
				control: '0.5rem',
				card: '1rem',
				panel: '1.5rem',
			},
			boxShadow: {
				raised: '0 1px 2px rgb(17 24 39 / 0.06), 0 10px 24px -12px rgb(17 24 39 / 0.16)',
				overlay: '0 24px 64px -16px rgb(17 24 39 / 0.35)',
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
			},
		},
		fontFamily: {
			sans:['Poppins', ...defaultTheme.fontFamily.sans],
			instrument: ['"Instrument Serif"', 'serif'],
		},
	},
	plugins: [],
}
