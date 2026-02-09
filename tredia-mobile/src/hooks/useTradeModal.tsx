// src/hooks/useTradeModal.tsx
import React, { useState, useCallback } from "react";
import TradeModal from "../components/TradeModal";

export interface UseTradeModalResult {
  openTradeModal: (symbol: string) => void;
  TradeModalElement: React.ReactNode;
}

export default function useTradeModal(): UseTradeModalResult {
  const [visible, setVisible] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);

  const openTradeModal = useCallback((sym: string) => {
    setSymbol(sym);
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const TradeModalElement = (
    <TradeModal visible={visible} symbol={symbol} onClose={handleClose} />
  );

  return {
    openTradeModal,
    TradeModalElement,
  };
}
