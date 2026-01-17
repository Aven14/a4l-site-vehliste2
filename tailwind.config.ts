import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Utiliser les variables CSS pour que le thème change dynamiquement
        primary: {
          50: 'hsl(from var(--accent-color) h s 95%)',
          100: 'hsl(from var(--accent-color) h s 90%)',
          200: 'hsl(from var(--accent-color) h s 80%)',
          300: 'hsl(from var(--accent-color) h s 70%)',
          400: 'var(--accent-color-400)',
          500: 'var(--accent-color-500)',
          600: 'var(--accent-color-600)',
          700: 'var(--accent-color-700)',
          800: 'hsl(from var(--accent-color) h s 30%)',
          900: 'hsl(from var(--accent-color) h s 20%)',
        },
        dark: {
          100: '#1e1e1e',
          200: '#181818',
          300: '#121212',
          400: '#0a0a0a',
        },
        accent: {
          gold: '#d4af37',
          orange: '#f97316',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
