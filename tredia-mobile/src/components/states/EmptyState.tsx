// src/components/states/EmptyState.tsx
import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import NeonButton from "../NeonButton";
import { trediaTheme } from "../../theme/trediaTheme";

const StyledView = styled(View);
const StyledText = styled(Text);

interface EmptyStateProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  message: string;
  ctaText: string;
  onCtaPress: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  message,
  ctaText,
  onCtaPress,
}) => {
  return (
    <StyledView className="flex-1 justify-center items-center p-8">
      <MaterialIcons
        name={icon}
        size={64}
        color={trediaTheme.colors.accentCyan}
        style={{ opacity: 0.8 }}
      />
      <StyledText className="text-lg text-gray-400 text-center mt-4 mb-8">
        {message}
      </StyledText>
      <NeonButton onPress={onCtaPress}>
        <Text className="text-white font-bold">{ctaText}</Text>
      </NeonButton>
    </StyledView>
  );
};

export default EmptyState;
