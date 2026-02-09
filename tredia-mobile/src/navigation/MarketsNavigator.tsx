// src/navigation/MarketsNavigator.tsx

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import PlanetScreen from "../screens/PlanetScreen";
import AssetDetailScreen from "../screens/AssetDetailScreen";

// ---- Stack param list for the Markets area ----
export type MarketsStackParamList = {
  MarketsHome: undefined;
  AssetDetail: { symbol: string };
};

const Stack = createNativeStackNavigator<MarketsStackParamList>();

// Wrapper so AssetDetailScreen can be used safely here,
// even though it is typed against the root stack.
type AssetDetailFromMarketsProps = NativeStackScreenProps<
  MarketsStackParamList,
  "AssetDetail"
>;

const AssetDetailFromMarkets: React.FC<AssetDetailFromMarketsProps> = ({
  route,
  navigation,
}) => {
  return (
    <AssetDetailScreen
      // AssetDetailScreen expects RootStack navigation/route,
      // so we cast here to keep TS happy without changing that file.
      route={route as any}
      navigation={navigation as any}
    />
  );
};

const MarketsNavigator: React.FC = () => {
  const theme: any = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="MarketsHome"
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      {/* Main markets hub (your PlanetScreen / MarketHub) */}
      <Stack.Screen
        name="MarketsHome"
        component={PlanetScreen}
        options={{ headerShown: false }}
      />

      {/* Asset detail from inside the Markets tab */}
      <Stack.Screen
        name="AssetDetail"
        component={AssetDetailFromMarkets}
        options={{
          headerTitle: "Asset detail",
        }}
      />
    </Stack.Navigator>
  );
};

export default MarketsNavigator;
