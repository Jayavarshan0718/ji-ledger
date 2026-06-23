/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "Impact", "sans-serif"],
        mono: ["'JetBrains Mono'", "Consolas", "monospace"],
      },
      animation: {
        "fade-slide-up": "fade-slide-up 0.5s ease-out forwards",
      },
      keyframes: {
        "fade-slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};