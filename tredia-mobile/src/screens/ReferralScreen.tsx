// src/screens/ReferralScreen.tsx

import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ReferralScreen() {
  const theme = useTheme();

  const referralCode = "TREDIA-52X9";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={[styles.header, { color: theme.text }]}>Referral Program</Text>

      <Text style={{ color: theme.textSoft, marginBottom: 20 }}>
        Invite friends to Tredia and earn exclusive rewards.
      </Text>

      <View
        style={[
          styles.codeBox,
          { backgroundColor: theme.surface, borderColor: theme.cardBorder },
        ]}
      >
        <Text style={{ fontSize: 24, fontWeight: "700", color: theme.accent }}>
          {referralCode}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.shareButton,
          { backgroundColor: theme.primary, borderColor: theme.cardBorder },
        ]}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>Share Code</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  codeBox: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  shareButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
});
