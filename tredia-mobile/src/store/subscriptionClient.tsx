// src/store/subscriptionClient.tsx

import React, { createContext, useContext, useState, useEffect } from "react";

export type SubscriptionPlan = "free" | "pro" | "elite";

export type SubscriptionStatus = {
  plan: SubscriptionPlan;
  expiresAt?: string | null;
  source: "local";
};

type SubscriptionContextValue = {
  status: SubscriptionStatus;
  setPlan: (plan: SubscriptionPlan) => void;
};

const defaultStatus: SubscriptionStatus = {
  plan: "free",
  expiresAt: null,
  source: "local",
};

const SubscriptionContext = createContext<SubscriptionContextValue>({
  status: defaultStatus,
  setPlan: () => {},
});

export const SubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [status, setStatus] = useState<SubscriptionStatus>(defaultStatus);

  // Si un jour tu veux recharger l’info depuis un backend, tu le fais ici
  useEffect(() => {
    // ex: fetch depuis API / stockage local
  }, []);

  const setPlan = (plan: SubscriptionPlan) => {
    setStatus((prev) => ({ ...prev, plan }));
  };

  return (
    <SubscriptionContext.Provider value={{ status, setPlan }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);

/**
 * Utilisé par SubscriptionScreen pour afficher l’état courant.
 * Pour l’instant, c’est un stub local (aucun appel réel RevenueCat).
 */
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  // Ici tu pourras plus tard brancher ton backend ou RevenueCat
  return defaultStatus;
};
