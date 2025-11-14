// src/screens/RegisterScreen.tsx
import React from "react";
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import NeonButton from "../components/NeonButton";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const RegisterScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
      <StyledView className="p-8 w-full max-w-sm">
        <StyledText className="text-3xl font-bold text-white text-center mb-8">
          Create Account
        </StyledText>
        <StyledTextInput
          className="bg-black/20 text-white rounded-input p-4 mb-4 border border-border"
          placeholder="Username"
          placeholderTextColor="gray"
          autoCapitalize="none"
        />
        <StyledTextInput
          className="bg-black/20 text-white rounded-input p-4 mb-4 border border-border"
          placeholder="Email"
          placeholderTextColor="gray"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <StyledTextInput
          className="bg-black/20 text-white rounded-input p-4 mb-6 border border-border"
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
        />
        <NeonButton onPress={() => { /* Handle registration */ }}>
          <Text className="text-white font-bold">Register</Text>
        </NeonButton>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default RegisterScreen;
