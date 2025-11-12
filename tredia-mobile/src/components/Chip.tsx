// src/components/Chip.tsx
import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

interface ChipProps {
  label: string;
  className?: string;
  textClassName?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  className = "bg-electricBlue/20",
  textClassName = "text-electricBlue",
}) => {
  return (
    <StyledView className={`px-3 py-1 rounded-full ${className}`}>
      <StyledText className={`text-xs font-medium ${textClassName}`}>
        {label}
      </StyledText>
    </StyledView>
  );
};

export default Chip;
