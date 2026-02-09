// src/types/theme.ts

export type AppTheme = {
  // Backgrounds
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceSoft: string;

  // Cards
  card: string;
  cardSoft: string;
  cardBorder: string;
  cardPositive: string;
  cardNegative: string;

  // Text
  text: string;
  textPrimary: string;
  textSoft: string;
  textMuted: string;

  // Main colors
  primary: string;      // legacy alias, some screens use theme.primary
  accent: string;
  accentSoft: string;

  // Status colors
  danger: string;
  success: string;
  warning: string;

  // Extras / chips / overlays
  overlay: string;
  surfaceGlass: string;
  chipBg: string;

  // Badges (used in Planet / Trends / etc)
  badgePositive: string;
  badgeNegative: string;
};
