import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function Stat(props: any) {
  const theme: any = useTheme();
  const { label, value } = props ?? {};

  return (
    <View style={[styles.box, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      <Text style={[styles.label, { color: theme.textSoft }]}>{String(label ?? "")}</Text>
      <Text style={[styles.value, { color: theme.textPrimary ?? theme.text }]}>{String(value ?? "—")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: 16, padding: 12 },
  label: { fontSize: 11 },
  value: { marginTop: 4, fontSize: 14, fontWeight: "800" },
});
