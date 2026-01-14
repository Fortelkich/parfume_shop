import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      colors: {
        noir: {
          900: "#050505",
          850: "#0b0b0b",
          800: "#15100c"
        },
        cacao: {
          700: "#3a2618",
          600: "#5c3b26",
          500: "#7b5234"
        },
        ivory: {
          100: "#f5f5f5",
          300: "#b5a89a"
        }
      },
      boxShadow: {
        glow: "0 12px 40px rgba(58, 38, 24, 0.35)",
        soft: "0 6px 18px rgba(0, 0, 0, 0.45)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
