// src/components/ui/SectionHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={{
        marginBottom: subtitle ? 4 : 8,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text
          style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              color: theme.muted,
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {actionLabel && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text
            style={{
              color: theme.accent,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
