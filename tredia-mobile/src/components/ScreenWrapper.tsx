// src/components/ScreenWrapper.tsx
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

type ScreenWrapperProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
};

export default function ScreenWrapper({
  children,
  scroll = true,
  padded = true,
}: ScreenWrapperProps) {
  const theme = useTheme(); // ✅ FIXED

  const Wrapper = scroll ? ScrollView : View;

  return (
    <Wrapper
      style={[
        styles.base,
        { backgroundColor: theme.background }, // ✅ theme is now always defined
        padded && styles.padded,
      ]}
      contentContainerStyle={scroll ? { paddingBottom: 40 } : undefined}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
