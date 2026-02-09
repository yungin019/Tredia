// src/components/GlowView.tsx
// Wrapper that adds a neon halo glow behind any element

import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

type GlowIntensity = "soft" | "medium" | "strong";

interface GlowViewProps {
  children: ReactNode;
  intensity?: GlowIntensity;
  radius?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function GlowView({
  children,
  intensity = "soft",
  radius = 22,
  style,
}: GlowViewProps) {
  const theme: any = useTheme();

  const glowStyles =
    {
      soft: {
        shadowColor: theme.accent,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
      },
      medium: {
        shadowColor: theme.accent,
        shadowOpacity: 0.45,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
      },
      strong: {
        shadowColor: theme.accent,
        shadowOpacity: 0.75,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 0 },
      },
    }[intensity] || {};

  return (
    <View style={[styles.wrapper, { borderRadius: radius }, glowStyles, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 22,
  },
});
