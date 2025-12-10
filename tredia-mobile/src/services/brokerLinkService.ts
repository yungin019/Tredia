// src/services/brokerLinkService.ts
import axios from "axios";
import Constants from "expo-constants";

const API_BASE_URL =
  (Constants?.expoConfig?.extra as any)?.API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:4000";

const client = axios.create({
  baseURL: `${API_BASE_URL}`, // we already include /api in api.ts; here we call full /api paths
});

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
  createdAt: string;
  updatedAt: string;
  broker?: {
    id: number;
    name: string;
    slug: string;
    connectionType: string;
    websiteUrl?: string | null;
    deepLinkPattern?: string | null;
    logoUrl?: string | null;
    isEnabled: boolean;
  } | null;
};

// -------- HELPERS --------

function authHeaders(authToken: string | null | undefined) {
  return authToken
    ? {
        Authorization: `Bearer ${authToken}`,
      }
    : undefined;
}

// -------- API CALLS --------

// GET /api/brokers/platforms  → { platforms: [...] }
export async function fetchAvailableBrokers(authToken: string | null) {
  const res = await client.get("/api/brokers/platforms", {
    headers: authHeaders(authToken),
  });
  return (res.data.platforms || []) as BrokerPlatform[];
}

// GET /api/brokers/me → { account: {...} }
export async function fetchMyBroker(authToken: string | null) {
  const res = await client.get("/api/brokers/me", {
    headers: authHeaders(authToken),
  });
  return (res.data.account || null) as UserBrokerAccount | null;
}

// POST /api/brokers/connect  body: { brokerSlug }
export async function connectBroker(
  authToken: string | null,
  brokerSlug: string
) {
  const res = await client.post(
    "/api/brokers/connect",
    { brokerSlug },
    {
      headers: authHeaders(authToken),
    }
  );

  return (res.data.account || null) as UserBrokerAccount | null;
}

// POST /api/brokers/disconnect
export async function disconnectBrokerApi(authToken: string | null) {
  const res = await client.post(
    "/api/brokers/disconnect",
    {},
    {
      headers: authHeaders(authToken),
    }
  );
  return res.data;
}

// GET /api/brokers/deeplink?symbol=TSLA → { url }
export async function getTradeDeeplink(
  authToken: string | null,
  symbol: string
) {
  const res = await client.get("/api/brokers/deeplink", {
    headers: authHeaders(authToken),
    params: { symbol },
  });
  return res.data.url as string;
}

// OPTIONAL: GET /api/brokers/portfolio
// useful later for a "Live from broker" tab in PortfolioScreen
export type LiveBrokerPortfolio = {
  provider: string;
  connected: boolean;
  baseCurrency: string;
  cash: number;
  startingCash: number;
  positions: {
    id: number;
    symbol: string;
    quantity: number;
    avgPrice: number;
    marketValue?: number;
    unrealizedPnl?: number;
  }[];
};

export async function fetchLivePortfolioFromBroker(
  authToken: string | null
): Promise<LiveBrokerPortfolio> {
  const res = await client.get("/api/brokers/portfolio", {
    headers: authHeaders(authToken),
  });
  return res.data as LiveBrokerPortfolio;
}
