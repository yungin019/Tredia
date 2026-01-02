// src/services/paperTradeService.ts

import { api } from "./api";

export type TradeSide = "buy" | "sell";
export type OrderType = "market" | "limit";

export interface ExecuteTradeRequest {
  symbol: string;
  side: TradeSide;
  quantity: number;
  orderType: OrderType;
  limitPrice?: number;
}

export interface ExecuteTradeResponse {
  success: boolean;
  portfolio?: any;
  position?: any;
  message?: string;
}

export async function executePaperTrade(
  payload: ExecuteTradeRequest
): Promise<ExecuteTradeResponse> {
  const res = await api.post("/api/paper/trade", payload);
  return res.data;
}
