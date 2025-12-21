// src/lib/access.ts
export type Plan = "free" | "pro" | "elite";

const FEATURE_REQUIREMENTS: Record<string, Plan> = {
  super_ai: "elite",
  signals: "pro",
  predictions: "pro",
  league: "pro",
  community: "free",
  portfolio_advanced: "pro",
};

function planRank(plan: Plan) {
  switch (plan) {
    case "free":
      return 0;
    case "pro":
      return 1;
    case "elite":
      return 2;
  }
}

export function hasAccess(plan: Plan | undefined, feature: string): boolean {
  // default to free if plan is missing
  const userPlan: Plan = plan ?? "free";
  const required = FEATURE_REQUIREMENTS[feature];
  if (!required) {
    // If unknown feature, default to deny
    return false;
  }
  return planRank(userPlan) >= planRank(required);
}

export function requireAccess(plan: Plan | undefined, feature: string): { ok: true } | { ok: false; reason: string } {
  const userPlan: Plan = plan ?? "free";
  const required = FEATURE_REQUIREMENTS[feature];
  if (!required) {
    return { ok: false, reason: "Feature not recognized" };
  }
  if (hasAccess(userPlan, feature)) return { ok: true };

  const needed = required === "elite" ? "Elite" : "Pro";
  return { ok: false, reason: `Upgrade to ${needed} to access this feature.` };
}

export const FEATURES = Object.keys(FEATURE_REQUIREMENTS);
