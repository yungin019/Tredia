// src/components/ui/Card.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type CardProps = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  footer?: ReactNode;
};

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  style,
  footer,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: 18,
          padding: 16,
          borderWidth: 1,
          borderColor: theme.cardSoft,
        },
        style,
      ]}
    >
      {(title || subtitle) && (
        <View style={{ marginBottom: children ? 10 : 0 }}>
          {title && (
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={{
                color: theme.muted,
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {children}

      {footer && (
        <View style={{ marginTop: 12 }}>
          {footer}
        </View>
      )}
    </View>
  );
};

export default Card;
