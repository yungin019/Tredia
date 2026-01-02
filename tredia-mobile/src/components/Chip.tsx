import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Chip(props: any) {
  const theme: any = useTheme();
  const { label, tone } = props ?? {};

  const color =
    tone === "success" ? theme.success :
    tone === "danger" ? theme.danger :
    theme.accent;

  return (
    <View style={[styles.chip, { borderColor: color, backgroundColor: theme.surface }]}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {String(label ?? "")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  text: { fontSize: 11, fontWeight: "700" },
});
