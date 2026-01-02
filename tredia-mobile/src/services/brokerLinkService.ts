import { Linking, Alert } from "react-native";
const BROKER_DEEP_LINKS: Record<string, string> = {
  etoro: "etoro://",
  tradingview: "tradingview://",
  binance: "binance://",
  avanza: "avanza://",
  trading212: "trading212://",
  revolut: "revolut://",
};

export async function openBrokerApp(broker: BrokerPlatform) {
  // Try official deep link if known
  const deepLink = broker.deepLinkPattern || BROKER_DEEP_LINKS[broker.slug];
  if (deepLink) {
    const canOpen = await Linking.canOpenURL(deepLink);
    if (canOpen) {
      await Linking.openURL(deepLink);
      return true;
    }
  }
  // Fallback to website
  if (broker.websiteUrl) {
    await Linking.openURL(broker.websiteUrl);
    return true;
  }
  Alert.alert(
    "Could not open broker",
    "We couldn’t open the broker app or website for this platform."
  );
  return false;
}
import { api } from "./apiClient";

export type BrokerPlatform = {
  id: number;
  name: string;
  slug: string;
  connectionType: string;
  websiteUrl?: string | null;
  deepLinkPattern?: string | null;
  logoUrl?: string | null;
  isEnabled: boolean;
};

export type UserBrokerAccount = {
  id: number;
  userId: number;
  brokerPlatformId: number;
  displayName: string | null;
  connectionStatus: "CONNECTED" | "DISCONNECTED";
  broker?: BrokerPlatform;
};

export async function fetchAvailableBrokers() {
  const res = await api.get("/brokers/platforms");
  return res.data.platforms as BrokerPlatform[];
}

export async function fetchMyBroker() {
  const res = await api.get("/brokers/me");
  return res.data.account as UserBrokerAccount | null;
}

export async function connectBroker(brokerSlug: string) {
  const res = await api.post("/brokers/connect", { brokerSlug });
  return res.data.account;
}

export async function getTradeDeeplink(symbol: string) {
  try {
    const res = await api.get("/brokers/deeplink", {
      params: { symbol },
    });
    return res.data.url;
  } catch (err: any) {
    if (err?.response?.data?.error === "NO_BROKER_OR_LINK") {
      const e = new Error("NO_BROKER_OR_LINK");
      (e as any).code = "NO_BROKER_OR_LINK";
      throw e;
    }
    throw err;
  }
}
