// src/screens/AssistantScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import GlassPanel from "../components/GlassPanel";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const AssistantScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0B1220]">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold text-white mb-6">
          Assistant
        </StyledText>
        <GlassPanel className="p-4">
          <StyledText className="text-white">Assistant Content</StyledText>
        </GlassPanel>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default AssistantScreen;
