// COMPLETE FIXED Surface.tsx

import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function Surface(props: ViewProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        styles.surface,
        {
          backgroundColor: theme.surfaceGlass, // FIX
          borderColor: theme.borderGlass, // FIX
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
});
