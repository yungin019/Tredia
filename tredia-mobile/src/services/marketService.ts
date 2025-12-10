// src/services/marketService.ts
// Mobile-side helper for markets + daily brief
// Used by HomeScreen & MarketExplorerScreen

import { api } from "./api";

export type MarketAsset = {
  symbol: string;
  name?: string;
  changePct: number;
  sparkline?: number[];
  price?: number;
  assetClass?: string;
};

export type DailyBrief = {
  summary: string;
  generatedAt?: string;
};

type MarketsTrendsResponse = {
  movers?: any[];
  trending?: any[];
  newsRadar?: any[];
  generatedAt?: string;
};

// --- INTERNAL: fetch /markets/trends once ---

async function fetchTrendsSnapshot(): Promise<MarketsTrendsResponse> {
  try {
    const res = await api.get<MarketsTrendsResponse>("/markets/trends");
    return res.data || {};
  } catch (e) {
    console.log("[marketService] /markets/trends error", e);
    return {};
  }
}

// --- PUBLIC: movers ---

export async function fetchMarketMovers(): Promise<MarketAsset[]> {
  const data = await fetchTrendsSnapshot();
  const moversRaw = Array.isArray(data.movers) ? data.movers : [];

  const movers: MarketAsset[] = moversRaw.map((item: any) => ({
    symbol: String(item.symbol ?? ""),
    name: item.name ?? undefined,
    changePct:
      typeof item.changePct === "number" ? item.changePct : 0,
    sparkline: Array.isArray(item.sparkline)
      ? item.sparkline
      : [],
    price:
      typeof item.price === "number" ? item.price : undefined,
    assetClass:
      typeof item.assetClass === "string"
        ? item.assetClass
        : undefined,
  }));

  return movers;
}

// --- PUBLIC: trending ---

export async function fetchTrending(): Promise<MarketAsset[]> {
  const data = await fetchTrendsSnapshot();
  const trendingRaw = Array.isArray(data.trending)
    ? data.trending
    : [];

  const trending: MarketAsset[] = trendingRaw.map((item: any) => ({
    symbol: String(item.symbol ?? ""),
    name: item.name ?? undefined,
    changePct:
      typeof item.changePct === "number" ? item.changePct : 0,
    sparkline: Array.isArray(item.sparkline)
      ? item.sparkline
      : [],
    price:
      typeof item.price === "number" ? item.price : undefined,
    assetClass:
      typeof item.assetClass === "string"
        ? item.assetClass
        : undefined,
  }));

  return trending;
}

// --- PUBLIC: AI daily brief ---

export async function fetchDailyBrief(): Promise<DailyBrief | null> {
  try {
    const res = await api.get<any>("/ai/daily-brief");
    const payload = res.data || {};

    const summary: string =
      typeof payload.summary === "string" && payload.summary.length > 0
        ? payload.summary
        : typeof payload.text === "string" && payload.text.length > 0
        ? payload.text
        : "";

    if (!summary) {
      return null;
    }

    const brief: DailyBrief = {
      summary,
      generatedAt:
        typeof payload.generatedAt === "string"
          ? payload.generatedAt
          : undefined,
    };

    return brief;
  } catch (e) {
    console.log("[marketService] /ai/daily-brief error", e);
    return null;
  }
}
