// src/components/SectionHeader.tsx
// Reusable section header for screens (Portfolio, Alerts, etc.)

import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightElement,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSoft },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {rightElement ? (
        <View style={styles.right}>{rightElement}</View>
      ) : null}
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
  },
  right: {
    marginLeft: 12,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
