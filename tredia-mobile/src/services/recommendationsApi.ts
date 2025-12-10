// src/services/recommendationsApi.ts
import { API_BASE_URL } from "../config/api";

class RecommendationsApi {
  async get(plan: "free" | "pro" | "elite") {
    const res = await fetch(`${API_BASE_URL}/api/ai/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    return await res.json();
  }
}

export const recommendationsApi = new RecommendationsApi();
