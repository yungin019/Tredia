import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import NeonButton from "../NeonButton";

export default function EmptyState(props: any) {
  const theme: any = useTheme();
  const { title = "Nothing here yet", body, ctaText = "Refresh", onCtaPress } = props ?? {};

  return (
    <View style={[styles.wrap, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <Text style={[styles.title, { color: theme.textPrimary ?? theme.text }]}>{title}</Text>
        {!!body && <Text style={[styles.body, { color: theme.textSoft }]}>{body}</Text>}

        {!!onCtaPress && (
          <View style={{ marginTop: 12 }}>
            <NeonButton label={ctaText} onPress={onCtaPress} glowColor={theme.accent} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16 },
  card: { borderWidth: 1, borderRadius: 20, padding: 16 },
  title: { fontSize: 16, fontWeight: "800" },
  body: { marginTop: 6, fontSize: 12, lineHeight: 16 },
});
