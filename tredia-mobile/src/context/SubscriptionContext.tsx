// src/context/SubscriptionContext.tsx
// 🔒 RevenueCat Disabled Mode
// Provides mock plan data so the UI keeps working without errors.

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type PlanName = "FREE" | "PRO" | "ELITE" | "FOUNDER";

type SubscriptionContextValue = {
  plan: PlanName;
  isFree: boolean;
  isPro: boolean;
  isElite: boolean;
  isFounder: boolean;
  setPlan: (plan: PlanName) => void;
  setCustomerInfo: (info: any) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(
  null
);

type ProviderProps = {
  appUserId: string | null;
  children: ReactNode;
};

export const SubscriptionProvider: React.FC<ProviderProps> = ({
  appUserId,
  children,
}) => {
  const [plan, setPlan] = useState<PlanName>("FREE");

  // Always FREE in disabled mode
  const isFree = plan === "FREE";
  const isPro = false;
  const isElite = false;
  const isFounder = false;

  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        isFree,
        isPro,
        isElite,
        isFounder,
        setPlan, // still available for later when we re-enable subs
        setCustomerInfo: () => {}, // placeholder
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () =>
  useContext(SubscriptionContext) as SubscriptionContextValue;
