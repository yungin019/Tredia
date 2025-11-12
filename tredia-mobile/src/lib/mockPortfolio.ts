// src/lib/mockPortfolio.ts

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  shares: string;
  value: string;
  change: string;
  isUp: boolean;
}

export const mockHoldings: Holding[] = [
  { id: "1", ticker: "TSLA", name: "Tesla, Inc.", shares: "100 shares", value: "$18,258.00", change: "+$1,476.00", isUp: true },
  { id: "2", ticker: "AAPL", name: "Apple, Inc.", shares: "50 shares", value: "$8,622.50", change: "-$122.50", isUp: false },
  { id: "3", ticker: "NVDA", name: "NVIDIA Corp.", shares: "20 shares", value: "$18,100.00", change: "+$2,420.00", isUp: true },
  { id: "4", ticker: "GOOGL", name: "Alphabet Inc.", shares: "30 shares", value: "$4,656.00", change: "+$186.00", isUp: true },
];

export const mockPortfolioStats = {
  balance: "$128,432.10",
  totalPL: "+$5,821.40",
  totalPLPercent: "+4.75%",
  winRate: "72%",
  riskLevel: "Medium",
};
