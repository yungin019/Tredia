// src/navigation/CommunityNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommunityTabsScreen from "./CommunityTabsScreen";
import PostCreateScreen from "../screens/PostCreateScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import { useTheme } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function CommunityNavigator() {
  const theme: any = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { color: theme.textPrimary },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="CommunityTabs"
        component={CommunityTabsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PostCreate"
        component={PostCreateScreen}
        options={{
          title: "Create Post",
        }}
      />

      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{
          title: "Post",
        }}
      />
    </Stack.Navigator>
  );
}
