export type HeatmapBias = "bullish" | "bearish" | "neutral";

export interface HeatmapItem {
  symbol: string;
  name: string;
  assetClass: "stock" | "crypto" | "forex" | "metal" | "etf" | "other";
  sector?: string | null;
  changePct: number;
  volatility?: number | null;
  aiBias: HeatmapBias;
  aiConfidence: number;
  sentimentScore?: number;
  jumpProbability?: number;
  heat: number;
}

export type DashboardSignalDirection = "long" | "short" | "watch";

export interface DashboardSignal {
  symbol: string;
  name: string;
  assetClass: HeatmapItem["assetClass"];
  sector?: string | null;
  direction: DashboardSignalDirection;
  heat: number;
  changePct: number;
  aiBias: HeatmapItem["aiBias"];
  aiConfidence: number;
  jumpProbability?: number;
  timeHorizon: string;
  thesis: any;
  riskNote: any;
  suggestedEntry?: number;
  suggestedStop?: number;
  suggestedTarget?: number;
  aiComment?: any;
}

export type SentimentLabel = "bullish" | "bearish" | "neutral";

export interface NewsSentiment {
  id: string;
  title: string;
  summary: string | null;
  sentimentLabel: SentimentLabel;
  sentimentScore: number;
  impactScore: number;
  impactedSymbols: string[];
  horizon: "intraday" | "swing" | "position";
  confidence: number;
  source?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  categories?: string[];
  aiComment?: string | null;
}

export interface AiDashboardPayload {
  generatedAt: string;
  heatmap: HeatmapItem[];
  spotlight: DashboardSignal[];
  summary?: any;
  newsSentiment?: NewsSentiment[];
}
