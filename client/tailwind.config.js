/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0c",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#6d28d9",
          hover: "#7c3aed",
          light: "#a78bfa",
        },
        secondary: {
          DEFAULT: "#1e1e24",
          hover: "#2a2a32",
        },
        accent: {
          DEFAULT: "#f59e0b",
          hover: "#fbbf24",
        },
        card: {
          DEFAULT: "rgba(30, 30, 36, 0.7)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
