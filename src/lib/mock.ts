import { MockData, FeedPost } from "./types";

export const mockFeedData: FeedPost[] = [
  {
    id: 1,
    title: "Recession Fears Ease",
    subtitle: "Economic indicators show surprising strength.",
    sentiment: "Bullish",
    tickers: ["$SPY", "$DJI"],
  },
  {
    id: 2,
    title: "Tech Stocks Rally",
    subtitle: "AI and cloud growth continue to drive the sector.",
    sentiment: "Bullish",
    tickers: ["$AAPL", "$GOOGL", "$MSFT"],
  },
  {
    id: 3,
    title: "Inflation Remains a Concern",
    subtitle: "The Fed is expected to raise rates again.",
    sentiment: "Bearish",
    tickers: ["$USD", "$GOLD"],
  },
  {
    id: 4,
    title: "Oil Prices Stabilize",
    subtitle: "OPEC+ production cuts have had a limited impact.",
    sentiment: "Neutral",
    tickers: ["$WTI", "$BRENT"],
  },
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
