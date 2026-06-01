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
          DEFAULT: "#0d6e57",
          dark: "#0a4f3f",
          light: "#e7f4ef",
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
