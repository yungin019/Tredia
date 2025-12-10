// src/components/NeonButton.tsx

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export type NeonButtonProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
  /** Optional override for neon glow + border color (used in AssetDetailScreen) */
  glowColor?: string;
};

export default function NeonButton({
  label,
  onPress,
  style,
  textStyle,
  disabled,
  glowColor,
}: NeonButtonProps) {
  const theme: any = useTheme();

  const accent =
    glowColor ??
    theme.accent ??
    theme.colors?.accent ??
    "#22d3ee";

  const surface =
    theme.surface ??
    theme.colors?.surface ??
    "#020617";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: surface,
          borderColor: accent,
          shadowColor: accent,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: accent,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",

    // Neon-style glow
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});
