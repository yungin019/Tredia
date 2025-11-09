import { MockData } from "./types";

export const mockFeedData: MockData[] = [
  { id: 1, title: "Stock A", value: 150.25, change: 2.5 },
  { id: 2, title: "Stock B", value: 75.5, change: -1.2 },
  { id: 3, title: "Stock C", value: 200.0, change: 5.0 },
];

export const mockTrendsData: MockData[] = [
  { id: 1, title: "Trend X", value: 80, change: 10 },
  { id: 2, title: "Trend Y", value: 65, change: -5 },
  { id: 3, title: "Trend Z", value: 95, change: 15 },
];

export const mockPortfolioData: MockData[] = [
  { id: 1, title: "Crypto", value: 12500, change: 500 },
  { id: 2, title: "Stocks", value: 25000, change: -1200 },
  { id: 3, title: "Commodities", value: 5000, change: 250 },
];
