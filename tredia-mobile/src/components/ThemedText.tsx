// src/design/ThemedText.tsx
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

export type TextVariant = "title" | "subtitle" | "label" | "muted" | "body";

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = "body",
  style,
  ...rest
}) => {
  const { theme } = useTheme() as any;

  let color: string =
    theme?.textPrimary || theme?.text || theme?.colors?.text || "#ffffff";
  let fontSize = 14;
  let fontWeight: TextStyle["fontWeight"] = "400";

  switch (variant) {
    case "title":
      fontSize = 22;
      fontWeight = "700";
      break;
    case "subtitle":
      fontSize = 16;
      fontWeight = "500";
      break;
    case "label":
      fontSize = 12;
      fontWeight = "600";
      color =
        theme?.accentPrimary ||
        theme?.colors?.accentPrimary ||
        color;
      break;
    case "muted":
      fontSize = 13;
      color =
        theme?.textSoft ||
        theme?.colors?.textSoft ||
        "#9ca3af";
      break;
    case "body":
    default:
      break;
  }

  return (
    <Text
      style={[
        {
          color,
          fontSize,
          fontWeight,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedText;
