import { Article, MockData } from "./types";

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

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Global Markets Rally as Tech Stocks Surge",
    source: "MarketWatch",
    time: "2h ago",
    sentiment: "Bullish",
    tickers: ["$AAPL", "$MSFT", "$GOOGL"],
    image: "/images/stock-market.jpg",
  },
  {
    id: "2",
    title: "Federal Reserve Hints at Tapering QE Program",
    source: "Reuters",
    time: "4h ago",
    sentiment: "Bearish",
    tickers: ["$SPY", "$QQQ"],
  },
  {
    id: "3",
    title: "New Innovations in AI Drive Chipmaker Stocks Higher",
    source: "Bloomberg",
    time: "1d ago",
    sentiment: "Bullish",
    tickers: ["$NVDA", "$AMD", "$INTC"],
    image: "/images/chip.jpg",
  },
  {
    id: "4",
    title: "Oil Prices Stabilize After Recent Volatility",
    source: "Associated Press",
    time: "1d ago",
    sentiment: "Neutral",
    tickers: ["$USO", "$BNO"],
  },
  {
    id: "5",
    title: "E-commerce Giant Reports Record Quarterly Earnings",
    source: "CNBC",
    time: "2d ago",
    sentiment: "Bullish",
    tickers: ["$AMZN", "$SHOP"],
    image: "/images/ecommerce.jpg",
  },
  {
    id: "6",
    title: "Analysts Debate Future of Renewable Energy Sector",
    source: "The Wall Street Journal",
    time: "3d ago",
    sentiment: "Neutral",
    tickers: ["$ICLN", "$TAN"],
  },
];
