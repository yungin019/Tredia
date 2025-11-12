// src/lib/mock.ts

export interface FeedItem {
  id: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  title: string;
  description: string;
}

export const mockFeedData: FeedItem[] = [
  {
    id: "1",
    sentiment: "Bullish",
    title: "Tech Giants Announce Major AI Partnership",
    description:
      "A new collaboration is set to accelerate AI development, potentially boosting the entire tech sector. Analysts predict significant stock price movements.",
  },
  {
    id: "2",
    sentiment: "Bearish",
    title: "Global Supply Chain Disruptions Worsen",
    description:
      "New reports indicate increasing pressure on global supply chains, with AI sentiment analysis pointing towards a cautious market outlook for the next quarter.",
  },
  {
    id: "3",
    sentiment: "Bullish",
    title: "Renewable Energy Stocks Surge on New Policy",
    description:
      "Government initiatives have sparked a rally in the green energy sector. AI models forecast continued upward momentum as investments pour in.",
  },
  {
    id: "4",
    sentiment: "Neutral",
    title: "Federal Reserve Holds Interest Rates Steady",
    description:
      "The central bank's decision was widely anticipated, leading to minimal market reaction. AI indicators suggest a 'wait-and-see' approach from investors.",
  },
];
