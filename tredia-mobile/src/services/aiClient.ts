// src/services/aiClient.ts
// all AI calls use the central api instance

import { api } from "./api";

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function chatWithAssistant(
  userId: number,
  messages: AiMessage[],
) {
  const res = await api.post("/assistant/chat", {
    userId,
    messages,
  });
  return res.data;
}

export { api };
