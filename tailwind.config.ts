// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './widgets/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './entities/**/*.{js,ts,jsx,tsx,mdx}',
    './_shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'desktop': '#008080',
        'window': '#c0c0c0',
        'title-bar': {
          active: '#000080',
          inactive: '#808080',
        },
        'border': {
          light: '#ffffff',
          dark: '#808080',
          darker: '#404040',
        },
      },
      fontFamily: {
        sans: ['"MS Sans Serif"', 'Tahoma', 'Geneva', 'sans-serif'],
        mono: ['"Lucida Console"', 'Monaco', 'monospace'],
      },
      // We'll add custom utilities for 3D borders later
    },
  },
  plugins: [],
}
export default config

