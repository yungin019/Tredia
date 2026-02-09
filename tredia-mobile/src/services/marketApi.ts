// src/services/marketApi.ts
import { API_BASE_URL } from "../config/api";

class MarketApi {
  async getTrends() {
    const res = await fetch(`${API_BASE_URL}/api/markets/trends`);
    return await res.json();
  }

  async getInfo(symbol: string) {
    const res = await fetch(`${API_BASE_URL}/api/markets/info/${symbol}`);
    return await res.json();
  }

  async getOHLC(symbol: string) {
    const res = await fetch(`${API_BASE_URL}/api/ohlc/${symbol}`);
    return await res.json();
  }
}

export const marketApi = new MarketApi();
