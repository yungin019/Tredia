// src/types/navigation.d.ts

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { TradeHubStackParamList } from "../navigation/TradeHubNavigator";

// 👇 Tous les écrans utilisés dans ton app
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  Register: undefined; // ton écran d'inscription actuel
  HomeTabs: undefined;

  // Stack de paper trading / trade hub
  TradeHubStack: NavigatorScreenParams<TradeHubStackParamList> | undefined;

  // Paywall / abonnements
  Paywall: undefined;

  // Détails d’un asset (ETHUSDT, BTCUSDT, NVDA, etc.)
  AssetDetail: { symbol: string };

  // Pour les accès directs depuis certains écrans
  PaperTrade: { symbol?: string };
  PaperHistory: undefined;
  Portfolio: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
