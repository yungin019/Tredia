// src/services/paperPortfolioService.ts

import api from "./api";

// -------------------
// Types from backend
// -------------------
export interface PortfolioPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
}

export interface PaperPortfolio {
  cash: number;
  totalValue: number;
  positions: PortfolioPosition[];
}

// -------------------
// Fetch user's portfolio
// -------------------
export async function getPaperPortfolio(): Promise<PaperPortfolio> {
  const res = await api.get("/paper/portfolio");
  return res.data;
}
