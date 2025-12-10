// src/navigation/HomeTabsNavigator.tsx

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";

import HomeScreen from "../screens/HomeScreen";
import AssistantScreen from "../screens/AssistantScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import CommunityNavigator from "./CommunityNavigator";
import ProfileNavigator from "./ProfileNavigator";
import MarketsNavigator from "./MarketsNavigator";

export type HomeTabsParamList = {
  Home: undefined;
  Markets: undefined;
  Planet: undefined;
  AI: undefined;
  Portfolio: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HomeTabsParamList>();

const HomeTabsNavigator: React.FC = () => {
  const theme: any = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.cardBorder,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSoft,
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* MARKETS */}
      <Tab.Screen
        name="Markets"
        component={MarketsNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          ),
        }}
      />

      {/* PLANET / COMMUNITY */}
      <Tab.Screen
        name="Planet"
        component={CommunityNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" size={size} color={color} />
          ),
        }}
      />

      {/* SUPER AI ASSISTANT */}
      <Tab.Screen
        name="AI"
        component={AssistantScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />

      {/* PORTFOLIO */}
      <Tab.Screen
        name="Portfolio"
        component={PortfolioScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" size={size} color={color} />
          ),
        }}
      />

      {/* PROFILE + SETTINGS STACK */}
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabsNavigator;
