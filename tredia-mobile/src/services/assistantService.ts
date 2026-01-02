// src/services/assistantService.ts

import { api } from "./apiClient";
import type { SubscriptionPlan } from "../store/subscriptionClient";

type AiPlan = SubscriptionPlan;

type AiChatResponse = {
  reply: string;
  plan?: AiPlan;
};

export const askTrediaAI = async (
  message: string,
  plan: AiPlan = "free"
): Promise<AiChatResponse> => {
  const res = await api.post("/ai/chat", {
    message,
    plan,
  });

  // Le backend renvoie { reply: string, ... } (comme on l’a défini)
  return res.data as AiChatResponse;
};
