// src/design/trediaTheme.ts

export const trediaTheme = {
  colors: {
    accentCyan: "#00FFFF",
    accentAqua: "#40E0D0",
    electricBlue: "#007BFF",
    gold: "#FFD700",
    profit: "#0BDA5B", // From various green-glow styles
    loss: "#E35068",   // From various red-glow styles
    cardBg: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
    text: "#F5F5F5",
    // Gradients will be handled in components/Tailwind config
  },
  radius: {
    card: "1rem",      // 16px
    modal: "1rem",     // 16px
    button: "0.5rem",  // 8px
    input: "0.5rem",   // 8px
  },
  shadows: {
    neon: "0 0 20px rgba(0, 184, 255, 0.35)",
    neonSm: "0 0 12px rgba(0, 184, 255, 0.25)",
  },
  spacing: {
    cardHorizontal: 24, // px-6
    cardVertical: 16,     // py-4
    gridGap: 24,          // gap-6
  },
  typography: {
    // These will map to font-inter-400, font-inter-500 etc. in Tailwind
    // Letter spacing will be applied via utility classes
  },
  charts: {
    axis: "rgba(255, 255, 255, 0.65)",
    grid: "rgba(255, 255, 255, 0.12)",
    line: "#007BFF", // electricBlue
    strokeWidth: 2.5,
    areaOpacity: 0.15,
  },
};

// This is a helper for extending the tailwind.config.js
export const tailwindThemeExtension = {
  colors: {
    ...trediaTheme.colors,
  },
  borderRadius: {
    card: trediaTheme.radius.card,
    modal: trediaTheme.radius.modal,
    btn: trediaTheme.radius.button,
    input: trediaTheme.radius.input,
  },
  boxShadow: {
    neon: trediaTheme.shadows.neon,
    "neon-sm": trediaTheme.shadows.neonSm,
  },
  spacing: {
    "card-h": `${trediaTheme.spacing.cardHorizontal}px`,
    "card-v": `${trediaTheme.spacing.cardVertical}px`,
    "grid-gap": `${trediaTheme.spacing.gridGap}px`,
  },
  fontFamily: {
    inter: ["Inter", "sans-serif"],
  },
};
