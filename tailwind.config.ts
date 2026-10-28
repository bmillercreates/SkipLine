import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: { 950: "#06101f", 900: "#0a1a33", 800: "#10284a" },
        accent: { DEFAULT: "#0a84ff", dark: "#0068d6" },
      },
      fontFamily: { sans: ["var(--font-lato)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
