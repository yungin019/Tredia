// src/components/Tooltip.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type TooltipProps = {
  label: string;
  children: React.ReactNode;
};

export default function Tooltip({ label, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
      >
        {children}
      </Pressable>

      {visible && (
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.tooltipText, { color: theme.text }]}>
            {label}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "flex-start",
  },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  tooltipText: {
    fontSize: 12,
  },
});
