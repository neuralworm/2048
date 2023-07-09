/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  safelist: [
    "top-0", "top-1/4", "top-1/2", "top-3/4",
    "left-0", "left-1/4", "left-1/2", "left-3/4",
    {
      pattern: /bg-(neutral)-/,
      pattern: /text-(neutral)-/,
    }
  ],
  plugins: [],
}
