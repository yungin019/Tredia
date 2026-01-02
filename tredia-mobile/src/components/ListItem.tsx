import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ListItem(props: any) {
  const theme: any = useTheme();
  const { title, subtitle, right, onPress } = props ?? {};

  const Container: any = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.row,
        { borderColor: theme.cardBorder, backgroundColor: theme.surface },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.textPrimary ?? theme.text }]}>
          {String(title ?? "")}
        </Text>
        {!!subtitle && (
          <Text style={[styles.subtitle, { color: theme.textSoft }]} numberOfLines={2}>
            {String(subtitle)}
          </Text>
        )}
      </View>

      {!!right && (
        <Text style={[styles.right, { color: theme.textSoft }]}>
          {String(right)}
        </Text>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { fontSize: 14, fontWeight: "700" },
  subtitle: { marginTop: 2, fontSize: 12 },
  right: { fontSize: 12, fontWeight: "600" },
});
