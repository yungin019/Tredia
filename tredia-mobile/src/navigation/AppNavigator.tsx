// src/navigation/AppNavigator.tsx
import React from "react";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = () => {
  const isAuthenticated = false; // Stub for now

  return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
