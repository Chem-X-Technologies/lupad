/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: '#00BFA5',
        secondary: '#FFB300',

        // Semantic Colors
        success: '#00BFA5',
        error: '#F44336',
        warning: '#FFB300',
        info: '#2196F3',

        // Neutral Colors
        'gray-light': '#F5F5F5',
        'gray-medium': '#9E9E9E',
        'gray-dark': '#333333',

        // Map Colors
        'route-line': '#5C6BC0',
        'pickup-marker': '#00BFA5',
        'dropoff-marker': '#FFB300',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
      },
    },
  },
  plugins: [],
};
