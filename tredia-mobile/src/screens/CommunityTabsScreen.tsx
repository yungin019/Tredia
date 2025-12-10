// src/navigation/CommunityTabsScreen.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../context/ThemeContext";

import CommunityFeedScreen from "../screens/CommunityFeedScreen";
import LiveActivityScreen from "../screens/LiveActivityScreen";
import CreatorsScreen from "../screens/CreatorsScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import RewardsScreen from "../screens/RewardsScreen";

const TopTab = createMaterialTopTabNavigator();

export default function CommunityTabsScreen() {
  const theme: any = useTheme();

  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
          borderBottomWidth: 0.5,
          borderColor: theme.cardBorder,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSoft,
        tabBarIndicatorStyle: {
          backgroundColor: theme.accent,
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: "600",
          fontSize: 13,
        },
      }}
    >
      <TopTab.Screen name="Feed" component={CommunityFeedScreen} />
      <TopTab.Screen name="Live" component={LiveActivityScreen} />
      <TopTab.Screen name="Creators" component={CreatorsScreen} />
      <TopTab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <TopTab.Screen name="Rewards" component={RewardsScreen} />
    </TopTab.Navigator>
  );
}
