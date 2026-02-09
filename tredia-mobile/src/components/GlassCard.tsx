// src/design/GlassCard.tsx
import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export interface GlassCardProps extends ViewProps {}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  ...rest
}) => {
  const { theme } = useTheme() as any;

  const bg =
    theme?.surfaceGlass ||
    theme?.glassCardBg ||
    "rgba(15, 23, 42, 0.85)";

  const borderColor =
    theme?.cardBorder ||
    theme?.colors?.cardBorder ||
    "rgba(148, 163, 184, 0.4)";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bg,
          borderColor,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
});

export default GlassCard;
