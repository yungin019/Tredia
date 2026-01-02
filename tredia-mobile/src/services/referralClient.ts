// src/services/referralClient.ts
import { api } from "./apiClient";

export type ReferralStatus = {
  code?: string;
  status?: string;
  rewardCredits?: number;
  [key: string]: any;
};

export async function getReferralStatus(): Promise<ReferralStatus> {
  const res = await api.get("/referral/status");
  return res.data;
}

export async function applyReferralCode(code: string) {
  const res = await api.post("/referral/apply", { code });
  return res.data;
}
