// src/components/TradeModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import {
  executePaperTrade,
  type ExecuteTradeRequest,
} from "../services/paperTradeService";

export interface TradeModalProps {
  visible: boolean;
  symbol: string | null;
  onClose: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({
  visible,
  symbol,
  onClose,
}) => {
  const theme = useTheme();

  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [quantity, setQuantity] = useState<string>("");
  const [limitPrice, setLimitPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetState = () => {
    setSide("buy");
    setOrderType("market");
    setQuantity("");
    setLimitPrice("");
    setErrorMsg(null);
  };

  const handleClose = () => {
    if (loading) return;
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!symbol) {
      setErrorMsg("Missing symbol for this trade.");
      return;
    }

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setErrorMsg("Please enter a valid quantity.");
      return;
    }

    let limit: number | undefined = undefined;
    if (orderType === "limit") {
      const lp = parseFloat(limitPrice);
      if (!limitPrice || isNaN(lp) || lp <= 0) {
        setErrorMsg("Please enter a valid limit price.");
        return;
      }
      limit = lp;
    }

    const payload: ExecuteTradeRequest = {
      symbol: symbol || "",
      side,
      quantity: qty,
      orderType,
      limitPrice: limit,
    };

    try {
      setLoading(true);
      setErrorMsg(null);
      await executePaperTrade(payload);
      handleClose();
    } catch (err) {
      console.error("Trade execution failed:", err);
      setErrorMsg("Failed to execute trade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.center}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]}>
              Simulate Trade
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSoft }]}>
              {symbol || "No symbol"} • Paper trading
            </Text>

            {/* Side Selector */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.pill,
                  side === "buy" && {
                    backgroundColor: theme.accentSoft,
                    borderColor: theme.accent,
                  },
                  side !== "buy" && {
                    backgroundColor: theme.surfaceSoft,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => setSide("buy")}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: side === "buy" ? theme.accent : theme.textSoft },
                  ]}
                >
                  Buy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pill,
                  side === "sell" && {
                    backgroundColor: theme.dangerSoft,
                    borderColor: theme.danger,
                  },
                  side !== "sell" && {
                    backgroundColor: theme.surfaceSoft,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => setSide("sell")}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: side === "sell" ? theme.danger : theme.textSoft },
                  ]}
                >
                  Sell
                </Text>
              </TouchableOpacity>
            </View>

            {/* Order type */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.pillSmall,
                  orderType === "market" && {
                    backgroundColor: theme.surfaceSoft,
                    borderColor: theme.accent,
                  },
                ]}
                onPress={() => setOrderType("market")}
              >
                <Text
                  style={[
                    styles.pillSmallText,
                    {
                      color:
                        orderType === "market"
                          ? theme.accent
                          : theme.textSoft,
                    },
                  ]}
                >
                  Market
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pillSmall,
                  orderType === "limit" && {
                    backgroundColor: theme.surfaceSoft,
                    borderColor: theme.accent,
                  },
                ]}
                onPress={() => setOrderType("limit")}
              >
                <Text
                  style={[
                    styles.pillSmallText,
                    {
                      color:
                        orderType === "limit" ? theme.accent : theme.textSoft,
                    },
                  ]}
                >
                  Limit (Pro / Elite)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quantity */}
            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSoft }]}>
                Quantity
              </Text>
              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="e.g. 10"
                placeholderTextColor={theme.textMuted}
                style={[
                  styles.input,
                  {
                    borderColor: theme.cardBorder,
                    color: theme.text,
                  },
                ]}
              />
            </View>

            {/* Limit price (only visible for limit orders) */}
            {orderType === "limit" && (
              <View style={styles.field}>
                <Text style={[styles.label, { color: theme.textSoft }]}>
                  Limit price
                </Text>
                <TextInput
                  value={limitPrice}
                  onChangeText={setLimitPrice}
                  keyboardType="numeric"
                  placeholder="e.g. 150.00"
                  placeholderTextColor={theme.textMuted}
                  style={[
                    styles.input,
                    {
                      borderColor: theme.cardBorder,
                      color: theme.text,
                    },
                  ]}
                />
              </View>
            )}

            {errorMsg && (
              <Text style={[styles.error, { color: theme.danger }]}>
                {errorMsg}
              </Text>
            )}

            {/* Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { borderColor: theme.cardBorder, backgroundColor: "transparent" },
                ]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: theme.textSoft }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: loading ? theme.textMuted : theme.accent,
                    borderColor: "transparent",
                  },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: theme.onAccent }]}>
                  {loading ? "Placing..." : "Place trade"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(3, 7, 18, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    width: "100%",
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  pillSmall: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  pillSmallText: {
    fontSize: 12,
    fontWeight: "500",
  },
  field: {
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  error: {
    marginTop: 8,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default TradeModal;
