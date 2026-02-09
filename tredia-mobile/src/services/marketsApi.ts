// src/services/marketsApi.ts

import { api } from "./aiClient";

export type TrendCategory = "ALL" | "CRYPTO" | "STOCKS" | "FOREX" | "METALS";

export interface TrendItem {
  symbol: string;
  name?: string;
  price?: number;
  changePct?: number;
  sparkline?: number[];
  assetClass?: string;
  [key: string]: any;
}

function normalizeArray(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.trends)) return raw.trends;
  if (Array.isArray(raw.data)) return raw.data;
  return [];
}

/**
 * Fetch market trends from your live backend.
 * The backend can optionally filter by ?category=crypto/stocks/forex/metals
 */
export async function fetchMarketTrends(
  category: TrendCategory
): Promise<TrendItem[]> {
  try {
    const params: Record<string, string> = {};

    if (category !== "ALL") {
      // You can adapt these mapping keys based on how your controller expects them
      params.category = category.toLowerCase(); // "crypto" | "stocks" | etc.
    }

    const res = await api.get("/markets/trends", { params });

    const list = normalizeArray(res.data);
    return list as TrendItem[];
  } catch (err) {
    console.warn("[marketsApi] fetchMarketTrends error:", err);
    return [];
  }
}
