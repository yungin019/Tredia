// src/context/PortfolioContext.tsx
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface PaperPosition {
  symbol: string;
  name: string;
  avgPrice: number;   // average entry price
  quantity: number;   // total shares/units
}

type PortfolioContextType = {
  cash: number;
  positions: PaperPosition[];
  totalValue: number;             // cash + positions
  buyPosition: (params: {
    symbol: string;
    name: string;
    price: number;
    amount: number;               // dollars to invest
  }) => void;
  sellPosition: (params: {
    symbol: string;
    price: number;                // sell price
  }) => void;
  resetPortfolio: () => void;
};

const INITIAL_CASH = 10000;

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [cash, setCash] = useState<number>(INITIAL_CASH);
  const [positions, setPositions] = useState<PaperPosition[]>([]);

  // --- BUY (paper) ---
  const buyPosition: PortfolioContextType["buyPosition"] = ({
    symbol,
    name,
    price,
    amount,
  }) => {
    if (!price || amount <= 0) return;
    if (amount > cash) {
      // not enough cash → just ignore for now
      return;
    }

    const quantityToBuy = amount / price;

    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === symbol);

      if (!existing) {
        return [
          ...prev,
          {
            symbol,
            name,
            avgPrice: price,
            quantity: quantityToBuy,
          },
        ];
      }

      const totalCostOld = existing.avgPrice * existing.quantity;
      const totalCostNew = totalCostOld + amount;
      const newQuantity = existing.quantity + quantityToBuy;
      const newAvgPrice = totalCostNew / newQuantity;

      return prev.map((p) =>
        p.symbol === symbol
          ? {
              ...p,
              avgPrice: newAvgPrice,
              quantity: newQuantity,
            }
          : p
      );
    });

    setCash((c) => c - amount);
  };

  // --- SELL ALL of a position (paper) ---
  const sellPosition: PortfolioContextType["sellPosition"] = ({
    symbol,
    price,
  }) => {
    if (!price) return;

    setPositions((prev) => {
      const existing = prev.find((p) => p.symbol === symbol);
      if (!existing) return prev;

      const proceeds = existing.quantity * price;
      setCash((c) => c + proceeds);

      // remove position completely
      return prev.filter((p) => p.symbol !== symbol);
    });
  };

  // --- RESET ---
  const resetPortfolio = () => {
    setCash(INITIAL_CASH);
    setPositions([]);
  };

  const totalValue = useMemo(() => {
    // for now: just cash + positions at avgPrice
    const positionsValue = positions.reduce(
      (sum, p) => sum + p.avgPrice * p.quantity,
      0
    );
    return cash + positionsValue;
  }, [cash, positions]);

  return (
    <PortfolioContext.Provider
      value={{
        cash,
        positions,
        totalValue,
        buyPosition,
        sellPosition,
        resetPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error("usePortfolio must be used inside PortfolioProvider");
  }
  return ctx;
};
