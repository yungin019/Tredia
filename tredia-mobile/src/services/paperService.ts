import { api } from "./apiClient";

export async function getPortfolio() {
  try {
    const res = await api.get("/paper/portfolio");
    return res.data;
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return { positions: [] };
  }
}

export async function executePaperTrade(
  symbol: string,
  amount: number,
  side: "BUY" | "SELL"
) {
  try {
    const res = await api.post("/paper/trade", {
      symbol,
      amount,
      side,
    });
    return res.data;
  } catch (err) {
    console.error("Paper trade error:", err);
    throw err;
  }
}
