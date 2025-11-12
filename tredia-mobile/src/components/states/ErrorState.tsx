// src/components/states/ErrorState.tsx
import React from "react";
import { Text } from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import NeonButton from "../NeonButton";
import GlassPanel from "../GlassPanel";

const StyledText = styled(Text);

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <GlassPanel className="p-6 m-4 items-center">
      <MaterialIcons name="error-outline" size={48} color="#E35068" />
      <StyledText className="text-lg text-gray-300 text-center mt-4 mb-6">
        {message}
      </StyledText>
      <NeonButton onPress={onRetry} className="bg-loss">
        <Text className="text-white font-bold">Retry</Text>
      </NeonButton>
    </GlassPanel>
  );
};

export default ErrorState;
