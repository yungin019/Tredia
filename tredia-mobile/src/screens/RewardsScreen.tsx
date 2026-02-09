// src/screens/RewardsScreen.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function RewardsScreen() {
  const theme: any = useTheme();

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Rewards & Achievements
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surfaceAlt,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text style={[styles.label, { color: theme.textSoft }]}>
            Status
          </Text>
          <Text style={[styles.value, { color: theme.primary }]}>
            Coming soon
          </Text>

          <Text style={[styles.label, { color: theme.textSoft }]}>
            What you&apos;ll see here
          </Text>
          <Text style={[styles.value, { color: theme.textPrimary }]}>
            OG badges, streaks, XP and community milestones.
          </Text>

          <Text style={[styles.label, { color: theme.textSoft }]}>
            How it will work
          </Text>
          <Text style={[styles.value, { color: theme.success }]}>
            Rewards will be based on real activity: AI usage, paper trading,
            challenges, and helpful contributions.
          </Text>
        </View>

        <Text style={[styles.text, { color: theme.textSoft }]}>
          This section is not live yet. Once the rewards engine and leaderboards
          are wired to the backend, your real progress and achievements will be
          displayed here — no screenshots, no fake stats.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },

  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },

  label: { fontSize: 14, marginTop: 10 },
  value: { fontSize: 16, fontWeight: "600" },

  text: { fontSize: 14, marginTop: 10, lineHeight: 20 },
});
