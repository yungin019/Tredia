// src/services/aiApi.ts
import { api } from "./apiClient";

class AiApi {
  async chat(message: string, plan: "free" | "pro" | "elite") {
    const res = await api.post("/ai/chat", {
      message,
      plan,
      portfolio: {},
      market: {},
    });

    return res.data;
  }
}

export const aiApi = new AiApi();
