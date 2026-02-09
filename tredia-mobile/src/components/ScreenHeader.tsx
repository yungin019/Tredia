// src/components/ScreenHeader.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  leftElement?: ReactNode;   // ✅ new optional prop
  rightElement?: ReactNode;  // ✅ optional (for actions)
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftElement,
  rightElement,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: theme.border },
      ]}
    >
      <View style={styles.row}>
        {/* LEFT SLOT (optional) */}
        <View style={styles.side}>
          {leftElement ? leftElement : null}
        </View>

        {/* CENTER TITLE */}
        <View style={styles.center}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary },
            ]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                { color: theme.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* RIGHT SLOT (optional) */}
        <View style={styles.side}>
          {rightElement ? rightElement : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0, // add if you want a line
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    minWidth: 60,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  center: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default ScreenHeader;
