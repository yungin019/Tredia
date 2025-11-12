// src/components/GlassPanel.tsx
import React from "react";
import { View } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

interface GlassPanelProps {
  children?: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className }) => {
  return (
    <StyledView
      className={`bg-cardBg border border-border rounded-card ${className}`}
    >
      {children}
    </StyledView>
  );
};

export default GlassPanel;
