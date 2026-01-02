// src/services/aiTradeCoach.ts

import { api } from "./apiClient";

export type AiCoachResponse = {
  message: string;
  confidence?: number;
  asset?: string;
};

export async function getAiTradeCoach(): Promise<AiCoachResponse> {
  try {
    const res = await api.get(`/ai/coach`);

    if (res.data) {
      return {
        message: res.data.message ?? "No AI comment available.",
        confidence: res.data.confidence,
        asset: res.data.asset,
      };
    }

    return { message: "AI did not respond." };
  } catch (e) {
    console.log("getAiTradeCoach ERROR:", e);
    return { message: "AI service temporarily unavailable." };
  }
}
