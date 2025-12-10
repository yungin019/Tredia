// src/navigation/CommunityTabsScreen.tsx
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../context/ThemeContext";

// Community screens
import CommunityScreen from "../screens/LiveActivityScreen";
import CreatorsScreen from "../screens/CreatorsScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import RewardsScreen from "../screens/RewardsScreen";

export type CommunityTopTabsParamList = {
  Feed: undefined;
  Creators: undefined;
  Leaderboard: undefined;
  Rewards: undefined;
};

const TopTab = createMaterialTopTabNavigator<CommunityTopTabsParamList>();

export default function CommunityTabsScreen() {
  const theme = useTheme();

  return (
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
      }}
    >
      {/* FEED = main hybrid community feed (AI + live activity) */}
      <TopTab.Screen
        name="Feed"
        component={CommunityScreen as React.ComponentType<any>}
        options={{ tabBarLabel: "Feed" }}
      />

      {/* TOP CREATORS */}
      <TopTab.Screen
        name="Creators"
        component={CreatorsScreen as React.ComponentType<any>}
        options={{ tabBarLabel: "Creators" }}
      />

      {/* LEADERBOARD */}
      <TopTab.Screen
        name="Leaderboard"
        component={LeaderboardScreen as React.ComponentType<any>}
        options={{ tabBarLabel: "Leaderboard" }}
      />

      {/* REWARDS / QUESTS */}
      <TopTab.Screen
        name="Rewards"
        component={RewardsScreen as React.ComponentType<any>}
        options={{ tabBarLabel: "Rewards" }}
      />
    </TopTab.Navigator>
  );
}
