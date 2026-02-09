import { api } from "./api";   // ✅ FIX — correct client

export type PlanName = "FREE" | "PRO" | "ELITE";

export interface PlanInfo {
  id: number;
  name: PlanName;
  description?: string | null;
  priceMonthly: number;
  currency: string;
  aiDailyLimit: number | null;
}

export interface UserPlanInfo {
  planName: PlanName;
  priceMonthly: number;
  currency: string;
  aiDailyLimit: number | null;
  remainingToday: number | null;
  usedToday?: number;
  source?: string;
}

export async function fetchPlans(): Promise<PlanInfo[]> {
  const res = await api.get("/plans");
  const data = res.data || {};
  const plans = Array.isArray(data.plans) ? data.plans : [];

  return plans.map((p: any): PlanInfo => ({
    id: typeof p.id === "number" ? p.id : 0,
    name: String(p.name || "FREE").toUpperCase() as PlanName,
    description: p.description ?? null,
    priceMonthly: typeof p.priceMonthly === "number" ? p.priceMonthly : 0,
    currency: String(p.currency || "SEK"),
    aiDailyLimit:
      typeof p.aiDailyLimit === "number" || p.aiDailyLimit === null
        ? p.aiDailyLimit
        : null,
  }));
}

export async function fetchUserPlan(): Promise<UserPlanInfo> {
  const res = await api.get("/user/plan");
  const data = res.data || {};

  return {
    planName: String(data.planName || "FREE").toUpperCase() as PlanName,
    priceMonthly:
      typeof data.priceMonthly === "number" ? data.priceMonthly : 0,
    currency: String(data.currency || "SEK"),
    aiDailyLimit:
      typeof data.aiDailyLimit === "number" || data.aiDailyLimit === null
        ? data.aiDailyLimit
        : null,
    remainingToday:
      typeof data.remainingToday === "number" || data.remainingToday === null
        ? data.remainingToday
        : null,
    usedToday: typeof data.usedToday === "number" ? data.usedToday : undefined,
    source: typeof data.source === "string" ? data.source : undefined,
  };
}

export async function changeUserPlan(
  planName: PlanName
): Promise<UserPlanInfo> {
  const res = await api.post("/user/plan", { planName });
  const data = res.data || {};

  return {
    planName: String(data.planName || planName).toUpperCase() as PlanName,
    priceMonthly:
      typeof data.priceMonthly === "number" ? data.priceMonthly : 0,
    currency: String(data.currency || "SEK"),
    aiDailyLimit:
      typeof data.aiDailyLimit === "number" || data.aiDailyLimit === null
        ? data.aiDailyLimit
        : null,
    remainingToday:
      typeof data.remainingToday === "number" || data.remainingToday === null
        ? data.remainingToday
        : null,
  };
}
