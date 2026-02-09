// src/components/Surface.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

export interface SurfaceProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  radius?: number;
  padding?: number;
  elevated?: boolean;
}

const Surface: React.FC<SurfaceProps> = ({
  children,
  style,
  radius = 16,
  padding = 16,
  elevated = false,
}) => {
  const theme  = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: radius,
          padding: padding,
          shadowColor: elevated ? "#000" : "transparent",
          shadowOpacity: elevated ? 0.15 : 0,
          shadowRadius: elevated ? 12 : 0,
          shadowOffset: elevated ? { width: 0, height: 4 } : { width: 0, height: 0 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Surface;
