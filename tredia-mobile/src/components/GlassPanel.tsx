// src/components/GlassPanel.tsx
import React from "react";
import { View, ViewProps } from "react-native";

interface GlassPanelProps extends ViewProps {
  children: React.ReactNode;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, style, ...rest }) => {
  return (
    <View
      style={[
        {
          backgroundColor: "#151b2e",
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "#2a3347",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default GlassPanel;
