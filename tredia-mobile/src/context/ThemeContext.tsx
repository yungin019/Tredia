// src/context/ThemeContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

import {
  getThemeForMode,
  type TrediaTheme,
  type ThemeMode as PaletteMode,
} from "../design/trediaTheme";

// Light/dark mode support (your screens only support dark for now)
export type ThemeMode = "light" | "dark";

export type ThemeShape = any;

interface ThemeContextValue extends ThemeShape {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Build normalized theme object from Tredia palette
function buildThemeFromPalette(mode: ThemeMode): ThemeShape {
  const palette: TrediaTheme = getThemeForMode(mode as PaletteMode);

  const colors = {
    // Surfaces
    background: palette.background,
    surface: palette.surface,
    surfaceAlt: palette.surfaceAlt,
    card: palette.card,
    cardBorder: palette.cardBorder,

    // Text
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textSoft: palette.textSoft,
    textMuted: palette.textMuted,

    // Accent & statuses
    accent: palette.accent,
    accentSoft: palette.accentSoft,
    success: palette.success,
    danger: palette.danger,
    warning: palette.warning,
  };

  return {
    mode,
    colors,

    // Flat surface aliases
    background: colors.background,
    surface: colors.surface,
    surfaceAlt: colors.surfaceAlt,
    card: colors.card,
    cardBorder: colors.cardBorder,

    // Flat text aliases
    textPrimary: colors.textPrimary,
    textSecondary: colors.textSecondary,
    textSoft: colors.textSoft,
    textMuted: colors.textMuted,
    text: colors.textPrimary,
    foreground: colors.textPrimary,

    // Accent aliases
    accent: colors.accent,
    accentSoft: colors.accentSoft,
    tint: colors.accent,

    // Status aliases
    success: colors.success,
    danger: colors.danger,
    warning: colors.warning,
    positive: colors.success,
    negative: colors.danger,

    border: colors.cardBorder,

    // Future-proof fields
    glow: undefined,
    gradients: undefined,
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const value = useMemo<ThemeContextValue>(() => {
    const themed = buildThemeFromPalette(mode);
    return {
      ...themed,
      mode,
      setMode,
      toggleMode: () =>
        setMode((prev) => (prev === "dark" ? "light" : "dark")),
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
