// src/components/GradientBackground.tsx
// Shared gradient background for Tredia screens

import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

interface GradientBackgroundProps {
  children: ReactNode;
}

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  const theme: any = useTheme();

  // Medium neon gradient — top-left → bottom-right
  // Deep navy core with subtle blue / purple glow.
  return (
    <LinearGradient
      colors={[
        "#020617", // deep navy
        "#02081B", // slightly lighter core
        "#050A30", // midnight blue
        "#0B102F", // subtle purple-ish edge
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
