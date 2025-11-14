// src/components/NeonLineChart.tsx
import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import GlassPanel from "./GlassPanel";

const StyledView = styled(View);
const StyledText = styled(Text);

const NeonLineChart = () => {
  return (
    <GlassPanel className="h-48 justify-center items-center">
      <StyledText className="text-white">Chart Placeholder</StyledText>
    </GlassPanel>
  );
};

export default NeonLineChart;
