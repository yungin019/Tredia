// src/api/ai.ts
import { api } from "./api";

export type NewsInsightRequest = {
  title: string;
  summary?: string;
  url?: string;
};

/**
 * Generic assistant chat endpoint.
 * Calls POST /ai/ask with { prompt } and returns the AI reply text.
 */
export async function askAssistant(prompt: string): Promise<string> {
  const response = await api.post<{ reply: string }>("/ai/ask", { prompt });
  return response.data.reply;
}

/**
 * News → AI insight endpoint.
 * Calls POST /ai/insight with { title, summary, url } and returns the insight text.
 */
export async function getNewsInsight(
  payload: NewsInsightRequest
): Promise<string> {
  const response = await api.post<{ insight: string }>("/ai/insight", payload);
  return response.data.insight;
}
