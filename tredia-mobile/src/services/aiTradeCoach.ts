// src/services/aiTradeCoach.ts

import axios from "axios";
import { API_BASE_URL } from "../config";

export type AiCoachResponse = {
  message: string;
  confidence?: number;
  asset?: string;
};

export async function getAiTradeCoach(): Promise<AiCoachResponse> {
  try {
    const res = await axios.get(`${API_BASE_URL}/ai/coach`);

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
