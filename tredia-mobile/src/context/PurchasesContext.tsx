// src/context/PurchasesContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import Purchases, {
  CustomerInfo,
  PurchasesPackage,
} from "react-native-purchases";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

type PurchasesOfferings = any;

type PlanKey = "free" | "pro" | "elite";

type PurchasesContextValue = {
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;
  activePlan: PlanKey;
  isPro: boolean;
  isElite: boolean;
  loading: boolean;
  purchasePackage: (pkg: PurchasesPackage) => Promise<void>;
  restore: () => Promise<void>;
};

const PurchasesContext = createContext<PurchasesContextValue | undefined>(
  undefined
);

// You will replace this with EXPO_PUBLIC_REVENUECAT_KEY in initPurchases,
// for now we still configure here as well in case you use it directly.
const REVENUECAT_API_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_KEY || "YOUR_REVENUECAT_PUBLIC_SDK_KEY_HERE";

function determinePlanFromCustomerInfo(info: CustomerInfo | null): PlanKey {
  if (!info) return "free";

  const active = info.entitlements?.active ?? {};
  const keys = Object.keys(active);

  if (keys.some((k) => k.toLowerCase().includes("elite"))) return "elite";
  if (keys.some((k) => k.toLowerCase().includes("pro"))) return "pro";

  return "free";
}

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { refreshToken } = useAuth();
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [activePlan, setActivePlan] = useState<PlanKey>("free");
  const [loading, setLoading] = useState<boolean>(true);

  const isPro = activePlan === "pro" || activePlan === "elite";
  const isElite = activePlan === "elite";

  // Sync plan to backend JWT
  const syncPlanWithBackend = async (plan: PlanKey) => {
    try {
      const res = await api.post<{ token: string }>(
        "/subscription/update-plan",
        { planName: plan }
      );
      if (res.data?.token) {
        await refreshToken(res.data.token);
      }
    } catch (err: any) {
      console.warn(
        "[Purchases] failed to sync plan with backend:",
        err?.message || err
      );
    }
  };

  const updatePlanFromCustomerInfo = async (info: CustomerInfo | null) => {
    const plan = determinePlanFromCustomerInfo(info);
    setActivePlan(plan);
    await syncPlanWithBackend(plan);
  };

  const loadPurchasesData = async () => {
    try {
      setLoading(true);

      Purchases.setLogLevel(Purchases.LOG_LEVEL.WARN);
      Purchases.configure({ apiKey: REVENUECAT_API_KEY });

      const [offs, info] = await Promise.all([
        Purchases.getOfferings(),
        Purchases.getCustomerInfo(),
      ]);

      setOfferings(offs);
      setCustomerInfo(info);

      await updatePlanFromCustomerInfo(info);
    } catch (err: any) {
      console.warn("[Purchases] init error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchasesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const purchasePackage = async (pkg: PurchasesPackage) => {
    try {
      setLoading(true);
      const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(newInfo);
      await updatePlanFromCustomerInfo(newInfo);
    } catch (err: any) {
      if (!err?.userCancelled) {
        console.warn("[Purchases] purchase error:", err?.message || err);
      }
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    try {
      setLoading(true);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
      await updatePlanFromCustomerInfo(info);
    } catch (err: any) {
      console.warn("[Purchases] restore error:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchasesContext.Provider
      value={{
        offerings,
        customerInfo,
        activePlan,
        isPro,
        isElite,
        loading,
        purchasePackage,
        restore,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

export const usePurchases = () => {
  const ctx = useContext(PurchasesContext);
  if (!ctx) {
    throw new Error("usePurchases must be used within a PurchasesProvider");
  }
  return ctx;
};
