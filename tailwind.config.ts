import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        burger: {
          red: "#e31b23",
          dark: "#0a0a0a",
          cream: "#fff8ea",
          gold: "#ffbf2f"
        }
      },
      boxShadow: {
        loud: "0 24px 80px rgba(227, 27, 35, 0.22)"
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
        display: ["Impact", "Arial Black", "Haettenschweiler", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
