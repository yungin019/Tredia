// src/services/assistantService.ts

import axios from "axios";
import { API_BASE_URL } from "../config";
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
  const res = await axios.post(`${API_BASE_URL}/ai/chat`, {
    message,
    plan,
  });

  // Le backend renvoie { reply: string, ... } (comme on l’a défini)
  return res.data as AiChatResponse;
};
