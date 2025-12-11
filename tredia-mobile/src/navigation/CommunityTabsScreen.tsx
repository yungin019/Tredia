// src/navigation/CommunityTabsScreen.tsx
import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const theme: any = useTheme();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <TopTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.cardBorder,
            marginTop: 4, // 👈 pushes the tab bar slightly down from the very top
          },
          tabBarIndicatorStyle: {
            backgroundColor: theme.accent,
            height: 3,
            borderRadius: 999,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSoft,
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "600",
            textTransform: "none",
          },
          tabBarItemStyle: {
            minWidth: 80, // 👈 avoid long labels being cut visually
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
          options={{ tabBarLabel: "Leaders" }} // 👈 shorter label, no ugly cut
        />

        {/* REWARDS / QUESTS */}
        <TopTab.Screen
          name="Rewards"
          component={RewardsScreen as React.ComponentType<any>}
          options={{ tabBarLabel: "Rewards" }}
        />
      </TopTab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
