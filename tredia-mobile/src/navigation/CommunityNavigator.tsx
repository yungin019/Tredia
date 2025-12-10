// src/navigation/CommunityNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CommunityTabsScreen from "./CommunityTabsScreen";

import PostCreateScreen from "../screens/PostCreateScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";

const Stack = createNativeStackNavigator();

export default function CommunityNavigator() {
  return (
    <Stack.Navigator>
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
