// src/theme.ts
import { trediaTheme } from "../theme/trediaTheme";

export const theme = {
  // Core
  background: trediaTheme.colors.background,
  bg: trediaTheme.colors.background,

  surface: trediaTheme.colors.surface,
  surfaceAlt: trediaTheme.colors.surfaceAlt,
  surfaceGlass: trediaTheme.colors.surfaceGlass,

  card: trediaTheme.colors.card,
  cardSoft: trediaTheme.colors.cardSoft,
  cardBorder: trediaTheme.colors.cardBorder,
  borderGlass: trediaTheme.colors.borderGlass,

  // Text
  textPrimary: trediaTheme.colors.textPrimary,
  textSoft: trediaTheme.colors.textSoft,
  textMuted: trediaTheme.colors.textMuted,
  heading: trediaTheme.colors.heading,

  // Accents (NEW)
  accentCyan: trediaTheme.colors.accentCyan,
  accentAqua: trediaTheme.colors.accentAqua,
  electricBlue: trediaTheme.colors.electricBlue,
  gold: trediaTheme.colors.gold,

  // Status
  success: trediaTheme.colors.success,
  danger: trediaTheme.colors.danger,

  // Gradients
  gradientPrimary: [
    trediaTheme.colors.electricBlue,
    trediaTheme.colors.accentAqua,
  ],

  gradientAmbient: [
    "rgba(0,150,255,0.45)",
    "rgba(0,150,255,0.0)",
  ],

  // Glow
  glowStrong: trediaTheme.shadows.neon,
  glowSoft: trediaTheme.shadows.neonSm,

  // Radius
  radius: {
    card: trediaTheme.radius.card,
    modal: trediaTheme.radius.modal,
    button: trediaTheme.radius.button,
    input: trediaTheme.radius.input,
  },

  // Spacing
  spacing: {
    cardHorizontal: trediaTheme.spacing.cardHorizontal,
    cardVertical: trediaTheme.spacing.cardVertical,
    gridGap: trediaTheme.spacing.gridGap,
  },

  // Charts
  charts: { ...trediaTheme.charts },
};

export type AppTheme = typeof theme;
