import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function LogoCard(props: any) {
  const theme: any = useTheme();
  const { title = "Tredia", subtitle } = props ?? {};

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.textPrimary ?? theme.text }]}>{title}</Text>
      {!!subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 20, padding: 14 },
  title: { fontSize: 16, fontWeight: "800" },
  subtitle: { marginTop: 4, fontSize: 12 },
});
