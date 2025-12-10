// src/services/marketService.ts (MOBILE SIDE)

import { api } from "./api";

export type MarketAsset = {
  symbol: string;
  name?: string | null;
  price?: number | null;
  changePct: number;
  assetClass?: string | null;
  sparkline?: number[];
};

type MarketsTrendsResponse = {
  movers?: any[];
  trending?: any[];
  newsRadar?: any[];
  generatedAt?: string;
};

type DailyBriefResponse = {
  title: string;
  text: string;
  summary?: string;
  generatedAt: string;
};

/**
 * Normalize a raw asset from /markets/trends into a safe shape
 * the HomeScreen expects.
 */
function normalizeAsset(raw: any): MarketAsset {
  const change =
    typeof raw?.changePct === "number" ? raw.changePct : 0;

  return {
    symbol: String(raw?.symbol ?? "").toUpperCase(),
    name:
      typeof raw?.name === "string" && raw.name.length > 0
        ? raw.name
        : String(raw?.symbol ?? "").toUpperCase(),
    price:
      typeof raw?.price === "number" ? raw.price : null,
    changePct: change,
    assetClass:
      typeof raw?.assetClass === "string"
        ? raw.assetClass
        : null,
    sparkline: Array.isArray(raw?.sparkline)
      ? (raw.sparkline as any[]).filter(
          (v) => typeof v === "number"
        )
      : [],
  };
}

/**
 * Fetch main market movers from /api/markets/trends.
 * Used on HomeScreen for AI Signals / Spotlight.
 */
export async function fetchMarketMovers(): Promise<MarketAsset[]> {
  try {
    const res = await api.get<MarketsTrendsResponse>(
      "/markets/trends"
    );

    const moversRaw = Array.isArray(res.data?.movers)
      ? res.data!.movers!
      : [];

    return moversRaw.map(normalizeAsset);
  } catch (err) {
    console.warn("[marketService] fetchMarketMovers error", err);
    return [];
  }
}

/**
 * Fetch trending list from /api/markets/trends.
 * Used for "Trending Now" + mini-watchlist.
 */
export async function fetchTrending(): Promise<MarketAsset[]> {
  try {
    const res = await api.get<MarketsTrendsResponse>(
      "/markets/trends"
    );

    const trendingRaw = Array.isArray(res.data?.trending)
      ? res.data!.trending!
      : [];

    return trendingRaw.map(normalizeAsset);
  } catch (err) {
    console.warn("[marketService] fetchTrending error", err);
    return [];
  }
}

/**
 * Fetch a short daily brief used on HomeScreen.
 */
export async function fetchDailyBrief(): Promise<DailyBriefResponse | null> {
  try {
    const res = await api.get<DailyBriefResponse>(
      "/ai/daily-brief"
    );
    return res.data;
  } catch (err) {
    console.warn("[marketService] fetchDailyBrief error", err);
    return null;
  }
}
