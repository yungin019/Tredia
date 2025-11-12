// src/screens/TrendsScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import GlassPanel from "../components/GlassPanel";
import NeonLineChart from "../components/NeonLineChart";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const TrendsScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0B1220]">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold text-white mb-6">
          Trends
        </StyledText>
        <NeonLineChart />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default TrendsScreen;
