// src/design/ThemedView.tsx
import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

export type SurfaceKind = "default" | "card" | "soft";

export interface ThemedViewProps extends ViewProps {
  surface?: SurfaceKind;
}

const ThemedView: React.FC<ThemedViewProps> = ({
  surface = "default",
  style,
  ...rest
}) => {
  const { theme } = useTheme() as any;

  let backgroundColor =
    theme?.background || theme?.colors?.background || "#020617";

  if (surface === "card") {
    backgroundColor =
      theme?.card ||
      theme?.surface ||
      theme?.colors?.card ||
      backgroundColor;
  } else if (surface === "soft") {
    backgroundColor =
      theme?.cardSoft ||
      theme?.surfaceSoft ||
      theme?.colors?.surfaceSoft ||
      backgroundColor;
  }

  return (
    <View
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedView;
