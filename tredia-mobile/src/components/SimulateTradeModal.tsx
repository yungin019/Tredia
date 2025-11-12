// src/components/SimulateTradeModal.tsx
import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { styled } from "nativewind";
import GlassPanel from "./GlassPanel";
import NeonButton from "./NeonButton";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledPressable = styled(Pressable);

interface SimulateTradeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SimulateTradeModal: React.FC<SimulateTradeModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <StyledPressable onPress={onClose} className="absolute inset-0 bg-black/60 justify-center items-center">
      <GlassPanel className="w-11/12 p-6">
        <StyledText className="text-xl font-bold text-white mb-4">
          Simulate a New Trade
        </StyledText>

        {/* Form Fields */}
        <StyledText className="text-sm font-medium text-gray-300 pb-2">Ticker Symbol</StyledText>
        <StyledTextInput
          className="bg-black/20 text-white rounded-input p-3 mb-4 border border-border"
          placeholder="e.g., NVDA"
          placeholderTextColor="gray"
        />

        <StyledText className="text-sm font-medium text-gray-300 pb-2">Side</StyledText>
        <StyledView className="flex-row bg-black/20 rounded-lg p-1 mb-4">
          <StyledPressable className="flex-1 p-2 bg-electricBlue/20 rounded-md items-center">
            <StyledText className="text-electricBlue font-bold">Long</StyledText>
          </StyledPressable>
          <StyledPressable className="flex-1 p-2 items-center">
            <StyledText className="text-gray-400">Short</StyledText>
          </StyledPressable>
        </StyledView>

        <StyledView className="flex-row justify-between mb-4">
          <StyledView className="flex-1 mr-2">
            <StyledText className="text-sm font-medium text-gray-300 pb-2">Entry Price</StyledText>
            <StyledTextInput
              className="bg-black/20 text-white rounded-input p-3 border border-border"
              placeholder="e.g., 905.00"
              placeholderTextColor="gray"
              keyboardType="numeric"
            />
          </StyledView>
          <StyledView className="flex-1 ml-2">
            <StyledText className="text-sm font-medium text-gray-300 pb-2">Quantity</StyledText>
            <StyledTextInput
              className="bg-black/20 text-white rounded-input p-3 border border-border"
              placeholder="e.g., 100"
              placeholderTextColor="gray"
              keyboardType="numeric"
            />
          </StyledView>
        </StyledView>

        {/* Action Buttons */}
        <NeonButton onPress={() => { /* Handle simulation logic */ onClose(); }}>
          <Text className="text-white font-bold">Start Simulation</Text>
        </NeonButton>
        <StyledPressable onPress={onClose} className="mt-3 p-3 items-center">
          <StyledText className="text-gray-400">Cancel</StyledText>
        </StyledPressable>
      </GlassPanel>
    </StyledPressable>
  );
};

export default SimulateTradeModal;
