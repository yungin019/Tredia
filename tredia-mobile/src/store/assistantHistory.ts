// src/store/assistantHistory.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AssistantRole = "user" | "assistant" | "system";

export interface AssistantMessage {
  id: string;
  role: AssistantRole;
  text: string;
  createdAt: string;
  meta?: Record<string, any>;
}

const STORAGE_KEY = "assistant_history";

export async function loadAssistantHistory(): Promise<AssistantMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn("loadAssistantHistory error", e);
    return [];
  }
}

export async function saveAssistantHistory(
  messages: AssistantMessage[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn("saveAssistantHistory error", e);
  }
}

export async function appendAssistantMessage(
  message: AssistantMessage
): Promise<AssistantMessage[]> {
  const existing = await loadAssistantHistory();
  const updated = [...existing, message];
  await saveAssistantHistory(updated);
  return updated;
}
