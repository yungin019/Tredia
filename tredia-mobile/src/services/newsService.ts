// src/services/newsService.ts
import { api } from "./aiClient";

export interface NewsItem {
  id: string;
  title: string;
  source?: string;
  publishedAt?: string;
  summary?: string;
  aiAngle?: string;
}

/**
 * Fetch LIVE AI-curated news from backend.
 * Endpoint: GET /api/ai/dashboard/news
 */
export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await api.get("/ai/dashboard/news");

    const payload = res.data || {};
    // Prefer `news`, but also be tolerant if you later alias `newsSentiment`
    const list = payload.news ?? payload.newsSentiment ?? payload;

    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.warn("[newsService] fetchNews error:", err);
    return [];
  }
}
