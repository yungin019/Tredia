// src/navigation/AppNavigator.tsx
import React from "react";
import AuthNavigator from "./AuthNavigator";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = () => {
  const isAuthenticated = true; // Stub for now

  return isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
