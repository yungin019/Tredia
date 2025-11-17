import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-dm-sans)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: {
          cyan: "#00B8FF",
          aqua: "#00FFC6",
          blue: "#5B8CFF",
          gold: "#FFB74A",
          profit: "#16E27C",
          loss: "#F85C50",
          purple: "#825BFF",
          pink: "#FF69E9",
        },
      },
      borderRadius: {
        md: "0.5rem",
        xl: "1rem",
        card: "1rem",
      },
      boxShadow: {
        neon: "0 0 20px -6px rgba(0,184,255,0.35)",
        neonSm: "0 0 12px -6px rgba(0,184,255,0.25)",
      },
      letterSpacing: {
        headings: "-0.01em",
        data: "0.01em",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
    },
  },
  plugins: [],
};
export default config;
