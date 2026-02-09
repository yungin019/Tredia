// src/api/client.ts
import axios from "axios";

/**
 * IMPORTANT:
 * - In iOS simulator: you can use http://localhost:4000
 * - On a real device with Expo Go: replace with your computer's LAN IP, e.g.:
 *   http://192.168.1.20:4000
 */
const API_BASE_URL = "http://192.168.1.14:4000"; // ⬅️ change to LAN IP for real device

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

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

export async function aiSuper(
  payload: SuperAiRequest
): Promise<SuperAiResponse> {
  const res = await api.post<SuperAiResponse>("/ai/super", payload);
  return res.data;
}
