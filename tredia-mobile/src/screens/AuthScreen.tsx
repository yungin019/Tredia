// src/screens/AuthScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import NeonButton from "../components/NeonButton";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const AuthScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0A0F1E] justify-center items-center">
      <StyledView className="p-8 w-full max-w-sm">
        <StyledText className="text-3xl font-bold text-white text-center mb-12">
          Tredia
        </StyledText>
        <NeonButton>
          <Text className="text-white font-bold">Sign In</Text>
        </NeonButton>
        <StyledView className="my-2" />
        <NeonButton className="bg-transparent border border-electricBlue">
          <Text className="text-electricBlue font-bold">Create Account</Text>
        </NeonButton>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default AuthScreen;
