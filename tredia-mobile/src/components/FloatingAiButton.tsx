// src/components/FloatingAiButton.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const FloatingAiButton: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const openAssistant = () => {
    navigation.navigate("Assistant");
  };

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.button,
          {
            backgroundColor: colors.surfaceGlass ?? "rgba(15,23,42,0.85)",
            borderColor: colors.cardBorder,
            shadowColor: colors.success ?? "#22c55e",
          },
        ]}
        onPress={openAssistant}
      >
        <Text style={[styles.label, { color: colors.textPrimary ?? "#fff" }]}>
          AI
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const SIZE = 56;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 18,
    bottom: 24,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});

export default FloatingAiButton;
