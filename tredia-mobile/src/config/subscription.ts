// src/config/subscription.ts

export const REVENUECAT_APP_USER_PREFIX = "tredia_user_";

// RevenueCat product identifiers
export const RC_PRODUCTS = {
  PRO_MONTHLY: "tredia_pro_monthly",
  ELITE_MONTHLY: "tredia_elite_monthly",
};

export type AppPlanName = "FREE" | "PRO" | "ELITE";

export const APP_PLAN_AI_LIMITS: Record<AppPlanName, { daily: number | null }> = {
  FREE: { daily: 10 },
  PRO: { daily: 100 },
  ELITE: { daily: null },
};

export const APP_PLAN_PRICES_SEK: Record<AppPlanName, number> = {
  FREE: 0,
  PRO: 99,
  ELITE: 179,
};
