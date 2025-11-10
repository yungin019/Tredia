export interface MockData {
  id: number;
  title: string;
  value: number;
  change: number;
}

export type Sentiment = "Bullish" | "Neutral" | "Bearish";

export interface Article {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: Sentiment;
  tickers: string[];
  image?: string;
}
