// src/components/ui/Divider.tsx
import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type DividerProps = {
  inset?: boolean;
  style?: object;
};

const Divider: React.FC<DividerProps> = ({ inset = false, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: theme.cardSoft,
          marginLeft: inset ? 12 : 0,
          marginVertical: 6,
        },
        style,
      ]}
    />
  );
};

export default Divider;
