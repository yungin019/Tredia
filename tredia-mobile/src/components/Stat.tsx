// src/components/Stat.tsx
import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface StatProps {
  label: string;
  value: string;
  className?: string;
}

const Stat: React.FC<StatProps> = ({ label, value, className }) => {
  return (
    <StyledView className={`flex-col ${className}`}>
      <StyledText className="text-sm text-gray-400">{label}</StyledText>
      <StyledText className="font-semibold text-white">{value}</StyledText>
    </StyledView>
  );
};

export default Stat;
