import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#0f1013",
        accent: {
          DEFAULT: "#ff5c1a", // Electric Orange
          soft: "#ff8a4c",
        },
        neon: "#4ade80", // geek green for status light
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.21, 1.02, 0.73, 1) forwards",
        "fade-in": "fade-in 0.4s ease forwards",
        "scale-in": "scale-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
