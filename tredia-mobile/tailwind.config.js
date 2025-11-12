/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accentCyan: "#00FFFF",
        accentAqua: "#40E0D0",
        electricBlue: "#007BFF",
        gold: "#FFD700",
        profit: "#0BDA5B",
        loss: "#E35068",
        cardBg: "rgba(255, 255, 255, 0.05)",
        border: "rgba(255, 255, 255, 0.1)",
        text: "#F5F5F5",
      },
      borderRadius: {
        card: "1rem",
        modal: "1rem",
        btn: "0.5rem",
        input: "0.5rem",
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 184, 255, 0.35)",
        "neon-sm": "0 0 12px rgba(0, 184, 255, 0.25)",
      },
      spacing: {
        "card-h": "24px",
        "card-v": "16px",
        "grid-gap": "24px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
