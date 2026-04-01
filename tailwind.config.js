const { theme } = require('./src/config/theme.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        dark: theme.colors.dark,
        'dark-navy': theme.colors.darkNavy,
        success: theme.colors.success,
        warning: theme.colors.warning,
        danger: theme.colors.danger,
        info: theme.colors.info,
      },
      fontFamily: {
        heading: [theme.typography.fontFamily.heading],
        body: [theme.typography.fontFamily.body],
        mono: [theme.typography.fontFamily.mono],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'quantum-pulse': 'quantumPulse 3s ease-in-out infinite',
        'wave-interference': 'waveInterference 4s ease-in-out infinite',
        'particle-float': 'particleFloat 6s ease-in-out infinite',
      },
      keyframes: theme.effects.animations,
    },
  },
  plugins: [],
}
