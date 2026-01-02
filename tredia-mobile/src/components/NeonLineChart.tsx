import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function NeonLineChart(props: any) {
  const theme: any = useTheme();
  const { title = "Chart", subtitle } = props ?? {};

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.textPrimary ?? theme.text }]}>{title}</Text>
      {!!subtitle && <Text style={[styles.subtitle, { color: theme.textSoft }]}>{subtitle}</Text>}
      <View style={[styles.placeholder, { borderColor: theme.cardBorder }]} />
      <Text style={[styles.note, { color: theme.textSoft }]}>
        (Placeholder chart — keeps TypeScript clean)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, padding: 14 },
  title: { fontSize: 14, fontWeight: "800" },
  subtitle: { marginTop: 2, fontSize: 12 },
  placeholder: { marginTop: 10, height: 120, borderWidth: 1, borderRadius: 16 },
  note: { marginTop: 8, fontSize: 11 },
});
