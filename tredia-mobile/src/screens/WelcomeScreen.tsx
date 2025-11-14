// src/screens/WelcomeScreen.tsx
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import NeonButton from "../components/NeonButton";
import { StackNavigationProp } from "@react-navigation/stack";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

type RootStackParamList = {
  SignIn: undefined;
  Register: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0B1220] justify-center items-center">
      <StyledView className="p-8 w-full max-w-sm">
        <StyledText className="text-4xl font-bold text-white text-center mb-4">
          Tredia
        </StyledText>
        <StyledText className="text-lg text-gray-400 text-center mb-12">
          AI-Powered Market Insights
        </StyledText>
        <NeonButton onPress={() => navigation.navigate('SignIn')}>
          <Text className="text-white font-bold">Sign In</Text>
        </NeonButton>
        <StyledView className="my-2" />
        <NeonButton
          onPress={() => navigation.navigate('Register')}
          className="bg-transparent border border-electricBlue"
        >
          <Text className="text-electricBlue font-bold">Create Account</Text>
        </NeonButton>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default WelcomeScreen;
