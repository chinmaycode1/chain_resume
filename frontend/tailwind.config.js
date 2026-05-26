/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00FF94',
        'electric-blue': '#00D4FF',
        'deep-black': '#020208',
        'dark-navy': '#0A0A1A',
        'purple-glow': '#7C3AED',
        'hot-pink': '#FF006E',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'space': ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FF94, 0 0 10px #00FF94' },
          '100%': { boxShadow: '0 0 20px #00FF94, 0 0 30px #00FF94, 0 0 40px #00FF94' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
