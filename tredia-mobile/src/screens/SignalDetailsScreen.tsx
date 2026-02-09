// src/screens/SignalDetailsScreen.tsx

import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SignalDetailsScreen() {
  const theme: any = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        padding: 20,
      }}
    >
      <Text
        style={{
          color: theme.text,
          fontSize: 22,
          marginBottom: 12,
        }}
      >
        Signal details
      </Text>

      <Text style={{ color: theme.secondary }}>
        This screen will show a full AI breakdown of a selected market signal.
      </Text>

      <Text
        style={{
          color: theme.textSoft,
          marginTop: 12,
        }}
      >
        Soon, you&apos;ll see direction (long / short), probability, time
        horizon, key drivers, and Tredia&apos;s explanation for why this setup
        matters — all based on real Super AI data, not screenshots.
      </Text>
    </View>
  );
}
