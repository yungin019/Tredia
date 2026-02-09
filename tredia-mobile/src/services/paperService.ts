// src/services/paperService.ts
import axios from "axios";
import { API_BASE_URL } from "../config/api";

// GET PORTFOLIO
export async function getPortfolio() {
  try {
    const res = await axios.get(`${API_BASE_URL}/paper/portfolio`);
    return res.data;
  } catch (err) {
    console.error("Portfolio fetch error:", err);
    return { positions: [] };
  }
}

// EXECUTE PAPER TRADE
export async function executePaperTrade(
  symbol: string,
  amount: number,
  side: "BUY" | "SELL"
) {
  try {
    const res = await axios.post(`${API_BASE_URL}/paper/trade`, {
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
