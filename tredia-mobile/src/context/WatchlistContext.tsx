// src/context/WatchlistContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type WatchlistSource = "FEED" | "TRENDS" | "OTHER";

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change?: string;
  sentiment?: "BULLISH" | "BEARISH" | "NEUTRAL";
  source?: WatchlistSource;
  createdAt: string; // ISO string
}

type WatchlistContextType = {
  items: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, "id" | "createdAt">) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleWatchlist: (item: Omit<WatchlistItem, "id" | "createdAt">) => void;
  isInWatchlist: (symbol: string) => boolean;
  clearWatchlist: () => void;
};

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  const isInWatchlist = (symbol: string): boolean => {
    return items.some((i) => i.symbol === symbol);
  };

  const addToWatchlist: WatchlistContextType["addToWatchlist"] = (item) => {
    setItems((prev) => {
      if (prev.some((i) => i.symbol === item.symbol)) {
        return prev; // already there
      }
      const now = new Date().toISOString();
      return [
        ...prev,
        {
          ...item,
          id: `${item.symbol}-${now}`,
          createdAt: now,
        },
      ];
    });
  };

  const removeFromWatchlist: WatchlistContextType["removeFromWatchlist"] = (
    symbol
  ) => {
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  };

  const toggleWatchlist: WatchlistContextType["toggleWatchlist"] = (item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.symbol === item.symbol);
      if (exists) {
        return prev.filter((i) => i.symbol !== item.symbol);
      }
      const now = new Date().toISOString();
      return [
        ...prev,
        {
          ...item,
          id: `${item.symbol}-${now}`,
          createdAt: now,
        },
      ];
    });
  };

  const clearWatchlist = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      isInWatchlist,
      clearWatchlist,
    }),
    [items]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error("useWatchlist must be used inside WatchlistProvider");
  }
  return ctx;
};
