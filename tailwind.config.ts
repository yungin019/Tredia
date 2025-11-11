import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#00B8FF",
          aqua: "#00FFC6",
          blue: "#5B8CFF",
          gold: "#FFB74A",
          profit: "#16E27C",
          loss: "#F85C50",
        },
      },
      borderRadius: {
        md: "0.5rem",
        xl: "1rem",
        card: "1rem",
      },
      boxShadow: {
        glass: "0 0 20px -6px rgba(0,184,255,0.25)",
        neon: "0 0 24px -4px rgba(0,184,255,0.45)",
        neonSm: "0 0 12px -4px rgba(0,184,255,0.35)",
      },
      letterSpacing: {
        tighter: "-0.02em",
        wider: "0.01em",
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
