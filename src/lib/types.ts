export type MockData = {
  id: number;
  title:string;
  value: number;
  change: number;
};

export type FeedPost = {
  id: number;
  title: string;
  subtitle: string;
  sentiment: "Bullish" | "Neutral" | "Bearish";
  tickers: string[];
};
