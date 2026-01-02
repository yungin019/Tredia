import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import NeonButton from "./NeonButton";

export type TradeSide = "BUY" | "SELL";

interface SimulateTradeModalProps {
  visible: boolean;
  symbol: string | null;
  presetSide?: TradeSide;
  onClose: () => void;
}

const SimulateTradeModal: React.FC<SimulateTradeModalProps> = ({
  visible,
  symbol,
  presetSide,
  onClose,
}) => {
  const theme: any = useTheme();

  const initialSide: TradeSide = useMemo(() => {
    if (presetSide === "SELL") return "SELL";
    return "BUY";
  }, [presetSide]);

  const [side, setSide] = useState<TradeSide>(initialSide);
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form each time it opens (and re-apply presetSide)
    if (visible) {
      setSide(initialSide);
      setEntryPrice("");
      setQuantity("");
      setError(null);
      setSubmitting(false);
    }
  }, [visible, initialSide]);

  const canSubmit = useMemo(() => {
    const q = Number(quantity);
    const p = Number(entryPrice);
    return !!symbol && Number.isFinite(q) && q > 0 && Number.isFinite(p) && p > 0 && !submitting;
  }, [symbol, quantity, entryPrice, submitting]);

  const submit = async () => {
    if (!symbol) return;
    setError(null);

    const qtyNum = Number(quantity);
    const priceNum = Number(entryPrice);

    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      setError("Quantity must be a positive number.");
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      setError("Entry price must be a positive number.");
      return;
    }

    setSubmitting(true);

    try {
      // Your backend expects:
      // POST /api/trade-intent { symbol, side, quantity }
      // POST /api/trade-confirm { symbol, side, quantity, price }
      await api.post("/trade-intent", {
        symbol,
        side,
        quantity: qtyNum,
      });

      await api.post("/trade-confirm", {
        symbol,
        side,
        quantity: qtyNum,
        price: priceNum,
      });

      onClose();
    } catch (e: any) {
      console.log("[SimulateTradeModal] submit error:", e?.message || e);
      setError("Trade simulation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const buyActive = side === "BUY";
  const sellActive = side === "SELL";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop]} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
          onPress={() => {}}
        >
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Simulate a New Trade
          </Text>

          <Text style={[styles.label, { color: theme.textSoft }]}>Ticker Symbol</Text>
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: theme.surfaceAlt, borderColor: theme.cardBorder },
            ]}
          >
            <Text style={[styles.symbolText, { color: theme.textPrimary }]}>
              {symbol ?? "—"}
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.textSoft }]}>Side</Text>
          <View
            style={[
              styles.sideRow,
              { backgroundColor: theme.surfaceAlt, borderColor: theme.cardBorder },
            ]}
          >
            <Pressable
              onPress={() => setSide("BUY")}
              style={[
                styles.sideBtn,
                buyActive && { backgroundColor: theme.accent },
              ]}
            >
              <Text
                style={[
                  styles.sideBtnText,
                  { color: buyActive ? "#020617" : theme.textSoft },
                ]}
              >
                BUY (Long)
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSide("SELL")}
              style={[
                styles.sideBtn,
                sellActive && { backgroundColor: theme.accent },
              ]}
            >
              <Text
                style={[
                  styles.sideBtnText,
                  { color: sellActive ? "#020617" : theme.textSoft },
                ]}
              >
                SELL (Short)
              </Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.label, { color: theme.textSoft }]}>Entry Price</Text>
              <TextInput
                value={entryPrice}
                onChangeText={setEntryPrice}
                placeholder="e.g., 180.50"
                placeholderTextColor={theme.textSoft}
                keyboardType="numeric"
                style={[
                  styles.input,
                  { color: theme.textPrimary, backgroundColor: theme.surfaceAlt, borderColor: theme.cardBorder },
                ]}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.label, { color: theme.textSoft }]}>Quantity</Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                placeholder="e.g., 2"
                placeholderTextColor={theme.textSoft}
                keyboardType="numeric"
                style={[
                  styles.input,
                  { color: theme.textPrimary, backgroundColor: theme.surfaceAlt, borderColor: theme.cardBorder },
                ]}
              />
            </View>
          </View>

          {!!error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}

          <View style={{ marginTop: 10 }}>
            <NeonButton
              label={submitting ? "Submitting..." : "Start Simulation"}
              onPress={submit}
              glowColor={theme.accent}
              disabled={!canSubmit}
            />
            {submitting && (
              <View style={{ marginTop: 10, alignItems: "center" }}>
                <ActivityIndicator color={theme.accent} />
              </View>
            )}

            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: theme.textSoft }]}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SimulateTradeModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.60)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 6,
  },
  inputWrap: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: "800",
  },
  sideRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    padding: 6,
    gap: 8,
  },
  sideBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sideBtnText: {
    fontSize: 12,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  error: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
