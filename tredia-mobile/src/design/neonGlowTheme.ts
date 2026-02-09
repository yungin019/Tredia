// src/design/neonGlowTheme.ts
// Premium Navy × Neon Tredia Theme with subtle glow

export const neonGlowTheme = {
  mode: "dark",

  // CORE SURFACES
  colors: {
    background: "#020617",      // deep navy
    surface: "#030A1A",         // richer navy surface
    surfaceAlt: "#041024",      // glassy backing
    card: "#071322",            // card with depth
    cardBorder: "rgba(56, 189, 248, 0.22)",

    // TEXT
    textPrimary: "#EAF6FF",
    textSecondary: "#A9BED1",
    textSoft: "#7F8EA2",
    textMuted: "rgba(148, 163, 184, 0.7)",

    // ACCENT / STATUS
    accent: "#38BDF8",          // neon blue
    accentSoft: "rgba(56, 189, 248, 0.15)",
    success: "#22C55E",
    danger: "#EF4444",
    warning: "#EAB308",
  },

  // RADII
  radii: {
    sm: 8,
    md: 14,
    lg: 24,
    xl: 32,
    full: 999,
  },

  // SHADOWS / GLOWS
  glow: {
    soft: {
      shadowColor: "rgba(56, 189, 248, 0.35)",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 16,
      elevation: 6,
    },
    medium: {
      shadowColor: "rgba(56, 189, 248, 0.45)",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 10,
    },
    strong: {
      shadowColor: "rgba(56, 189, 248, 0.65)",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 32,
      elevation: 14,
    },
  },

  // GRADIENTS
  gradients: {
    hero: ["#0E1A2A", "#020617"],
    accent: ["#38BDF8", "#0EA5E9"],
    glowLine: ["rgba(56,189,248,0.4)", "rgba(56,189,248,0.03)"],
  },
};

export default neonGlowTheme;
