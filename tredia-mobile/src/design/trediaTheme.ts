// src/design/trediaTheme.ts

export type ThemeMode = "light" | "dark";

export interface TrediaTheme {
  // Core surfaces
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;

  // Borders
  border: string;
  cardBorder: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textSoft: string;
  textMuted: string;

  // Accent & status colors
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  warning: string;
}

// 🌙 Dark mode — navy / neon vibe
export const darkTheme: TrediaTheme = {
  background: "#020617", // slate-950
  surface: "#02081B",
  surfaceAlt: "#020B24",
  card: "#02081B",

  border: "#111827",
  cardBorder: "#111827",

  textPrimary: "#E5E7EB",
  textSecondary: "#9CA3AF",
  textSoft: "#9CA3AF",
  textMuted: "#6B7280",

  accent: "#38BDF8", // neon-ish blue
  accentSoft: "rgba(56, 189, 248, 0.18)",

  success: "#22C55E",
  danger: "#EF4444",
  warning: "#EAB308",
};

// ☀️ Light mode — clean but still Tredia
export const lightTheme: TrediaTheme = {
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceAlt: "#F3F4F6",
  card: "#FFFFFF",

  border: "#E5E7EB",
  cardBorder: "#E5E7EB",

  textPrimary: "#020617",
  textSecondary: "#4B5563",
  textSoft: "#6B7280",
  textMuted: "#9CA3AF",

  accent: "#2563EB",
  accentSoft: "rgba(37, 99, 235, 0.12)",

  success: "#16A34A",
  danger: "#DC2626",
  warning: "#D97706",
};

export const getThemeForMode = (mode: ThemeMode): TrediaTheme =>
  mode === "light" ? lightTheme : darkTheme;

// ✅ Default export used by src/theme/theme.ts
const trediaTheme: TrediaTheme = darkTheme;
export default trediaTheme;
