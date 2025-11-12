// src/navigation/MainTabNavigator.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import FeedScreen from "../screens/FeedScreen";
import TrendsScreen from "../screens/TrendsScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import AssistantScreen from "../screens/AssistantScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Navbar from "../components/Navbar";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <Navbar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Trends" component={TrendsScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Assistant" component={AssistantScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" color={color} size={size} />
          ),
        }}/>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
