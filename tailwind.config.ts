import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#FFF6F9",
          100: "#FDE9F0",
          200: "#FBD3E1",
          300: "#F7B3CB",
          400: "#F088AC",
          500: "#E55D8E",
          600: "#D23F76",
          700: "#AE2E5E",
          800: "#8C274C",
          900: "#6E2140",
        },
        plum: {
          50: "#F7F1F5",
          100: "#EDE2E9",
          300: "#BFA5B6",
          500: "#7E5B72",
          700: "#5A3350",
          800: "#42243A",
          900: "#2E1828",
        },
        mint: {
          100: "#E4F6F0",
          300: "#A7E0CD",
          500: "#5FC3A6",
          700: "#2F8F74",
        },
        lavender: {
          100: "#F1ECFB",
          300: "#C9B6E4",
          500: "#9B7FD4",
          700: "#6E52AD",
        },
        cream: "#FFFAF6",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 18px 45px -20px rgba(174, 46, 94, 0.35)",
        card: "0 10px 30px -18px rgba(66, 36, 58, 0.28)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
