// src/navigation/CommunityTabsScreen.tsx
import React from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";

// Community screens
import CommunityScreen from "../screens/LiveActivityScreen";
import CreatorsScreen from "../screens/CreatorsScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import RewardsScreen from "../screens/RewardsScreen";

export type CommunityTopTabsParamList = {
  Feed: undefined;
  Creators: undefined;
  Leaders: undefined; // renamed
  Rewards: undefined;
};

const TopTab = createMaterialTopTabNavigator<CommunityTopTabsParamList>();

export default function CommunityTabsScreen() {
  const theme: any = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top, // ⬅️ fixes high tabs
        backgroundColor: theme.background,
      }}
    >
      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.accent,
            height: 3,
          },
          tabBarActiveTintColor: theme.textPrimary,
          tabBarInactiveTintColor: theme.textSoft,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            textTransform: "none",
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}
      >
        <TopTab.Screen
          name="Feed"
          component={CommunityScreen as React.ComponentType<any>}
          options={{ tabBarLabel: "Feed" }}
        />

        <TopTab.Screen
          name="Creators"
          component={CreatorsScreen as React.ComponentType<any>}
          options={{ tabBarLabel: "Creators" }}
        />

        {/* Shorter label so it won’t cut */}
        <TopTab.Screen
          name="Leaders"
          component={LeaderboardScreen as React.ComponentType<any>}
          options={{ tabBarLabel: "Leaders" }}
        />

        <TopTab.Screen
          name="Rewards"
          component={RewardsScreen as React.ComponentType<any>}
          options={{ tabBarLabel: "Rewards" }}
        />
      </TopTab.Navigator>
    </View>
  );
}
