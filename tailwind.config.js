/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Playfair Display'", 'serif'],
        body: ["'Lora'", 'serif'],
      },
      colors: {
        ink: '#1A1A2E',
        cream: '#F5F1E8',
        night: '#0F0F1A',
        nightDeep: '#0A0A14',
        card: '#1A1A2E',
        accent: '#6C63FF',
        muted: '#8888AA',
        mutedLight: '#6B6B7B',
      },
    },
  },
  plugins: [],
};
