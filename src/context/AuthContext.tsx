"use client";

import React from "react";
import { getToken as getStoredToken, setToken as storeToken, clearToken as removeStoredToken } from "@/lib/authToken";
import { apiGet } from "@/lib/api";

type PlanObj = {
  id: number;
  name: string;
  description?: string | null;
  priceMonthly?: number | null;
  currency?: string | null;
} | null;

export type PlanResponse = {
  userId: number;
  plan: PlanObj;
  planId?: number | null;
  isFounder: boolean;
  founderPriceMonthly?: number | null;
  limits: { aiPerDay: number; paperTradesPerDay: number };
  _version?: string;
} | null;

type AuthContextValue = {
  token: string | null;
  plan: PlanObj | null;
  rawPlanResponse: PlanResponse;
  isLoading: boolean;
  refreshPlan: () => Promise<void>;
  setToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = React.useState<string | null>(null);
  const [plan, setPlan] = React.useState<PlanObj | null>(null);
  const [rawPlanResponse, setRawPlanResponse] = React.useState<PlanResponse>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const refreshPlan = React.useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setPlan(null);
      setRawPlanResponse(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiGet("/api/user/plan");
      setRawPlanResponse(res as any);
      setPlan((res as any)?.plan ?? null);
    } catch (err: any) {
      // If unauthorized, clear token and reset
      if (err?.status === 401) {
        removeStoredToken();
        setTokenState(null);
        setPlan(null);
        setRawPlanResponse(null);
      } else {
        // keep plan null on error but don't crash
        setPlan(null);
        setRawPlanResponse(null);
        console.error("[AuthContext] refreshPlan error:", err?.message || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Hydrate token from storage on mount
    const t = getStoredToken();
    if (t) {
      setTokenState(t);
      // Kick off plan fetch
      void refreshPlan();
    }
  }, [refreshPlan]);

  const setToken = React.useCallback((t: string) => {
    storeToken(t);
    setTokenState(t);
    void refreshPlan();
  }, [refreshPlan]);

  const logout = React.useCallback(() => {
    removeStoredToken();
    setTokenState(null);
    setPlan(null);
    setRawPlanResponse(null);
  }, []);

  const value: AuthContextValue = React.useMemo(() => ({
    token,
    plan,
    rawPlanResponse,
    isLoading,
    refreshPlan,
    setToken,
    logout,
  }), [token, plan, rawPlanResponse, isLoading, refreshPlan, setToken, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
