import type { Config } from 'tailwindcss'

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'cpm-red': '#c40000',
        'cpm-red-hover': '#c4000093',
        'cpm-bg': '#1e1e1e',
        'cpm-shadow': '#ffffffff',
        'cpm-bg-inputs': '#242424ff',
        'cpm-panel': '#141414',
        'scroll-bar': 'rgb(53, 53, 53)'
      }
    },
  },
  plugins: [],
}

export default config;
