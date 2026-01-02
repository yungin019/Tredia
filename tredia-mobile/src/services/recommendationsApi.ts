// src/services/recommendationsApi.ts
import { api } from "./apiClient";

class RecommendationsApi {
  async get(plan: "free" | "pro" | "elite") {
    const res = await api.post("/ai/recommendations", { plan });
    return res.data;
  }
}

export const recommendationsApi = new RecommendationsApi();
