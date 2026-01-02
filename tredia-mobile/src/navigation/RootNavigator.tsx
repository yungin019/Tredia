// src/navigation/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";

// Auth / onboarding
import WelcomeScreen from "../screens/WelcomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import SignInScreen from "../screens/SignInScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Main tab navigator
import HomeTabsNavigator, { HomeTabsParamList } from "./HomeTabsNavigator";

// Extra screens
import AlertsScreen from "../screens/AlertsScreen";
import AssetDetailScreen from "../screens/AssetDetailScreen";
import PaperTradeScreen from "../screens/PaperTradeScreen";
import SubscriptionScreen from "../screens/SubscriptionScreen";
import PaywallScreen from "../screens/PaywallScreen";
import LinkBrokerScreen from "../screens/LinkBrokerScreen";

// Re-export the main tabs param list
export type MainTabParamList = HomeTabsParamList;

export type RootStackParamList = {
  // AUTH / ONBOARDING
  Welcome: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Register: undefined;

  // MAIN APP
  HomeTabs: undefined;

  // ALERTS
  Alerts: undefined;

  // ASSET DETAIL
  AssetDetail: {
    symbol: string;
    presetSide?: "BUY" | "SELL";
    source?: string;
    autoOpenTrade?: boolean;
  };

  // PAPER TRADE
  PaperTrade: {
    symbol: string;
    assetType: string;
  };

  // BROKER LINKING
  LinkBroker: { brokerId?: string };

  // SUBSCRIPTIONS
  Subscription: undefined;
  Paywall: {
    planName: string;
    priceMonthly: number;
    currency?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      {/* AUTH / ONBOARDING */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />

      <Stack.Screen name="SignUp" component={RegisterScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* MAIN */}
      <Stack.Screen name="HomeTabs" component={HomeTabsNavigator} />

      {/* ALERTS */}
      <Stack.Screen name="Alerts" component={AlertsScreen} />

      {/* ASSET DETAIL */}
      <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />

      {/* BROKER LINKING */}
      <Stack.Screen name="LinkBroker" component={LinkBrokerScreen} />

      {/* PAPER TRADE */}
      <Stack.Screen
        name="PaperTrade"
        component={PaperTradeScreen}
        options={{
          headerShown: true,
          headerTitle: "Paper trade",
        }}
      />

      {/* SUBSCRIPTIONS / PAYWALL */}
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{
          headerShown: true,
          headerTitle: "Subscription",
        }}
      />

      <Stack.Screen
        name="Paywall"
        component={PaywallScreen as React.ComponentType<any>}
        options={{
          headerShown: true,
          headerTitle: "Upgrade plan",
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
