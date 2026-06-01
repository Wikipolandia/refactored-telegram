import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        brand: {
          DEFAULT: "#0d5c4a",
          dark: "#0a4538",
          light: "#e6f2ee",
        },
        // Compliance score bands
        clear: "#15803d",
        warn: "#b45309",
        risk: "#b91c1c",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
