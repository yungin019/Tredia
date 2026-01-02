import { api } from "./apiClient";

class MarketApi {
  async getTrends() {
    const res = await api.get("/markets/trends");
    return res.data;
  }

  async getInfo(symbol: string) {
    const res = await api.get(`/markets/info/${symbol}`);
    return res.data;
  }

  async getOHLC(symbol: string) {
    const res = await api.get(`/ohlc/${symbol}`);
    return res.data;
  }
}

export const marketApi = new MarketApi();
