/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        softly: {
          bg: "#FDFCF8",
          text: "#292524",
          muted: "#78716C",
          coral: "#FFB7B2",
          sage: "#E8EFE8",
          lavender: "#EFEDF4",
          blush: "#FFE4E1",
          periwinkle: "#E6E6FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
        cursive: ["var(--font-reenie)", "Reenie Beanie", "cursive"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        floating: "0 10px 30px -5px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
      },
      animation: {
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "float-reverse": "floatSlow 6s ease-in-out infinite reverse",
        "pulse-gentle": "pulseGentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGentle: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.04)", opacity: "0.9" },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
