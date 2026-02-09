// src/services/referralClient.ts

import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

export interface ReferralStatus {
  referralCode: string | null;
  referralBonusCredits: number;
  introDiscountEligible: boolean;
}

export async function fetchReferralStatus(): Promise<ReferralStatus> {
  const res = await api.get("/referral/status");
  return res.data;
}

export async function generateReferralCode(): Promise<string> {
  const res = await api.post("/referral/generate");
  return res.data.referralCode as string;
}

export async function applyReferralCode(code: string): Promise<{
  success: boolean;
  referrerId: number;
  referrerEmail: string;
  friendId: number;
  introDiscountEligible: boolean;
}> {
  const res = await api.post("/referral/apply", { code });
  return res.data;
}
