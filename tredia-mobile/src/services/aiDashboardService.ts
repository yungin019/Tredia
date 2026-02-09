// tredia-mobile/src/services/aiDashboardService.ts
import { api } from "./api";      // ✅


export type SignalDirection = "up" | "down" | "flat" | "bullish" | "bearish";

export interface AiSignal {
  id: number;
  title: string;
  text: string;
  symbol?: string;
  direction: SignalDirection;
  movePct?: number;
  confidence?: number;
  horizon?: string;
}

export interface AiDashboardData {
  summary: {
    title: string;
    text: string;
  };
  signals: AiSignal[];
}

/**
 * Call backend AI dashboard endpoint.
 * GET http://<API_BASE_URL>/api/ai/dashboard
 */
export async function fetchAiDashboard(): Promise<AiDashboardData> {
  const res = await api.get<AiDashboardData>("/ai/dashboard"); // ✅ no /api
  return res.data;
}
