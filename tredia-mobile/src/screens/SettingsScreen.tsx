// src/screens/SettingsScreen.tsx
import React from "react";
import { View, Text, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import ListItem from "../components/ListItem";
import { trediaTheme } from "../design/trediaTheme";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const SettingsScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0A0F1E]">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold text-white mb-6">
          Settings
        </StyledText>

        <ListItem
          icon="color-lens"
          title="Theme"
          rightContent={<StyledText className="text-gray-400">Dark</StyledText>}
        />
        <ListItem
          icon="notifications"
          title="Push Notifications"
          rightContent={
            <Switch
              value={true}
              thumbColor={"#FFF"}
              trackColor={{ false: "#767577", true: trediaTheme.colors.electricBlue }}
            />
          }
        />
        <ListItem
          icon="email"
          title="Email Alerts"
          rightContent={
            <Switch
              value={false}
              thumbColor={"#FFF"}
              trackColor={{ false: "#767577", true: trediaTheme.colors.electricBlue }}
            />
          }
        />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default SettingsScreen;
