import { api } from "./aiClient";

export async function fetchPaperPortfolio() {
  const res = await api.get("/paper/portfolio");
  return res.data;
}

export async function placePaperTrade(payload: {
  symbol: string;
  side: "BUY" | "SELL";
  price: number;
  quantity: number;
  assetType: string;
}) {
  const res = await api.post("/paper/trade", payload);
  return res.data;
}

export async function fetchPaperPerformance() {
  const res = await api.get("/paper/performance");
  return res.data;
}
