import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function AlertCard(props: any) {
  const theme: any = useTheme();
  const {
    title,
    message,
    subtitle,
    onPress,
    rightText,
  } = props ?? {};

  const Container: any = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.cardBorder },
      ]}
    >
      <View style={{ flex: 1 }}>
        {!!title && (
          <Text style={[styles.title, { color: theme.textPrimary ?? theme.text }]}>
            {title}
          </Text>
        )}
        {!!subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSoft }]}>
            {subtitle}
          </Text>
        )}
        {!!message && (
          <Text style={[styles.body, { color: theme.textSoft }]} numberOfLines={3}>
            {message}
          </Text>
        )}
      </View>

      {!!rightText && (
        <Text style={[styles.rightText, { color: theme.accent }]}>
          {rightText}
        </Text>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  title: { fontSize: 14, fontWeight: "700" },
  subtitle: { marginTop: 2, fontSize: 12 },
  body: { marginTop: 6, fontSize: 12, lineHeight: 16 },
  rightText: { fontSize: 12, fontWeight: "700" },
});
