// src/api/ai.ts
import { api } from "../services/apiClient";

/* ---------- Types for Super AI ---------- */

export type Opportunity = {
  symbol: string;
  direction: "Bullish" | "Bearish" | "Neutral";
  confidence: number; // 0–1
  horizon: string;
  rationale: string[];
  risk_level: "Low" | "Medium" | "High";
};

export type RiskItem = {
  symbol: string;
  direction: "Bullish" | "Bearish" | "Neutral";
  rationale: string[];
};

export type RelatedEvent = {
  headline: string;
  link: string;
  relevance: "Low" | "Medium" | "High";
  tags: string[];
};

export type MarketOutlook = {
  bias_24h: "Bullish" | "Bearish" | "Neutral";
  confidence: number; // 0–1
};

export type SuperAiResponse = {
  summary: string;
  market_outlook: MarketOutlook;
  opportunities: Opportunity[];
  risks: RiskItem[];
  related_events: RelatedEvent[];
};

export type SuperAiRequest = {
  question?: string;
  portfolio?: any[];
  watchlist?: any[];
};

/* ---------- AI helpers ---------- */

export async function aiChat(message: string): Promise<string> {
  const res = await api.post<{ reply: string }>("/ai/chat", { message });
  return res.data.reply;
}

export async function aiSuper(payload: SuperAiRequest): Promise<SuperAiResponse> {
  const res = await api.post<SuperAiResponse>("/ai/super", payload);
  return res.data;
}
