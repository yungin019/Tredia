// src/hooks/useTradeModal.tsx
import React, { useCallback, useMemo, useState } from "react";
import TradeModal, { PresetSide } from "../components/TradeModal";

export type OpenTradeModalOptions = {
  presetSide?: PresetSide;
};

export interface UseTradeModalResult {
  openTradeModal: (symbol: string, options?: OpenTradeModalOptions) => void;
  TradeModalElement: React.ReactNode;
}

export default function useTradeModal(): UseTradeModalResult {
  const [visible, setVisible] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [presetSide, setPresetSide] = useState<PresetSide | undefined>(undefined);

  const openTradeModal = useCallback((sym: string, options?: OpenTradeModalOptions) => {
    setSymbol(sym);
    setPresetSide(options?.presetSide);
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const TradeModalElement = useMemo(
    () => (
      <TradeModal
        visible={visible}
        symbol={symbol}
        presetSide={presetSide}
        onClose={handleClose}
      />
    ),
    [visible, symbol, presetSide, handleClose]
  );

  return {
    openTradeModal,
    TradeModalElement,
  };
}
