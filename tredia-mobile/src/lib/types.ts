// src/lib/types.ts

// ---------- Common ----------

export type Sentiment = "BULLISH" | "BEARISH" | "NEUTRAL";

// ---------- News / Feed ----------

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: Sentiment;
  source: string;
  timeAgo: string;
  readTime: string;
  imageUrl?: string;
  // used by ArticleModal when you have the full body
  fullArticle?: string;
}

// Ticker / top movers (for Market Pulse, Trends, etc.)
export interface MarketMover {
  id: string;
  symbol: string;
  name: string;
  price: string;        // formatted, e.g. "$495.22"
  change: string;       // e.g. "+8.7%"
  sentiment: "bullish" | "bearish";
  volume?: string;      // e.g. "52.3M"
}

// ---------- Analysts / Social layer ----------

export interface Analyst {
  id: string;
  name: string;
  accuracy: string;     // "94%" (kept as string because UI just displays it)
  followers: string;    // "12.4K"
  trades: string;       // "156"
  avatarUrl?: string;
}

// ---------- Portfolio ----------

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: string;       // "$420.15"
  currentPrice: string;   // "$495.22"
  totalValue: string;     // "$24,761"
  gainLoss: string;       // "+$3,753.50"
  gainLossPercent: string; // "+17.9%"
  sentiment: "bullish" | "bearish";
}

// ---------- Rewards / XP ----------

export type MissionStatus = "DONE" | "IN_PROGRESS" | "LOCKED";

export interface Mission {
  id: string;
  title: string;
  description: string;
  xp: number;
  status: MissionStatus;
  // e.g. "2/3" – only for IN_PROGRESS
  progress?: string;
}

export interface UserXP {
  totalXP: number;      // 1250
  level: number;        // 3
  nextLevelXP: number;  // 2000
}

// ---------- Assistant (optional but nice to have) ----------

export type MessageType = "user" | "assistant";

export interface AssistantMessage {
  id: string;
  type: MessageType;
  text: string;
  timestamp: string;
}
