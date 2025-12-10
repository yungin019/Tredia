// src/services/aiApi.ts
import { API_BASE_URL } from "../config/api";

class AiApi {
  async chat(message: string, plan: "free" | "pro" | "elite") {
    const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        plan,
        portfolio: {},
        market: {},
      }),
    });

    return await res.json();
  }
}

export const aiApi = new AiApi();
