// src/components/ConfidenceBar.tsx
import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ConfidenceBarProps {
  confidence: number; // 0–1
  height?: number;
}

export default function ConfidenceBar({ confidence, height = 6 }: ConfidenceBarProps) {
  const theme = useTheme();

  // Convert confidence (0–1) → %
  const widthPct = useMemo(() => {
    if (confidence < 0) return 0;
    if (confidence > 1) return 100;
    return Math.round(confidence * 100);
  }, [confidence]);

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: theme.surfaceAlt,
          borderColor: theme.cardBorder,
          height,
        },
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${widthPct}%`,
            backgroundColor: theme.accent,
            shadowColor: theme.accent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 10,
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
