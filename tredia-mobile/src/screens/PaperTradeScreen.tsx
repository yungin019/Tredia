// src/screens/PaperTradeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { placePaperTrade } from "../services/paperClient";

type PaperTradeRouteParams = {
  symbol: string;
  assetType?: string;
};

type PaperTradeScreenProps = {
  navigation: any;
  route: { params?: PaperTradeRouteParams };
};

const PaperTradeScreen: React.FC<PaperTradeScreenProps> = ({
  navigation,
  route,
}) => {
  const theme: any = useTheme();

  const symbol = route?.params?.symbol ?? "";
  const assetType = route?.params?.assetType ?? "stock";

  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const priceNum = parseFloat(price.replace(",", "."));
    const qtyNum = parseFloat(quantity.replace(",", "."));

    if (!symbol) {
      Alert.alert("Missing symbol", "No symbol provided for this trade.");
      return;
    }

    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      Alert.alert("Invalid price", "Please enter a valid price.");
      return;
    }

    if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
      Alert.alert("Invalid quantity", "Please enter a valid quantity.");
      return;
    }

    try {
      setLoading(true);

      await placePaperTrade({
        symbol,
        side,
        price: priceNum,
        quantity: qtyNum,
        assetType,
      });

      Alert.alert("Trade placed", "Your paper trade has been recorded.");
      navigation.goBack();
    } catch (err: any) {
      console.error("[PaperTradeScreen] place trade error", err);
      const msg =
        err?.response?.data?.error ||
        "Could not place trade. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.safe, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text
              style={[styles.backText, { color: theme.textSoft }]}
            >
              ← Back
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text
              style={[styles.title, { color: theme.textPrimary }]}
            >
              Paper trade
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.textSoft }]}
            >
              {symbol} · {assetType}
            </Text>
          </View>
        </View>

        {/* SIDE TOGGLE */}
        <View
          style={[
            styles.sideRow,
            {
              backgroundColor: theme.surfaceAlt,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.sideButton,
              side === "BUY" && {
                backgroundColor: theme.success,
              },
            ]}
            onPress={() => setSide("BUY")}
          >
            <Text
              style={[
                styles.sideLabel,
                { color: side === "BUY" ? "#020617" : theme.textPrimary },
              ]}
            >
              BUY
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sideButton,
              side === "SELL" && {
                backgroundColor: theme.danger,
              },
            ]}
            onPress={() => setSide("SELL")}
          >
            <Text
              style={[
                styles.sideLabel,
                { color: side === "SELL" ? "#020617" : theme.textPrimary },
              ]}
            >
              SELL
            </Text>
          </TouchableOpacity>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.textSoft }]}>
            Price
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.textSoft}
          />

          <Text
            style={[
              styles.label,
              { color: theme.textSoft, marginTop: 12 },
            ]}
          >
            Quantity
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.textSoft}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: theme.accent,
              opacity:
                loading || !price.trim() || !quantity.trim() ? 0.5 : 1,
            },
          ]}
          disabled={loading || !price.trim() || !quantity.trim()}
          onPress={onSubmit}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#020617" />
          ) : (
            <Text style={styles.submitLabel}>
              Confirm {side} {symbol}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PaperTradeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  sideRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 999,
    padding: 4,
    marginBottom: 20,
  },
  sideButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sideLabel: {
    fontSize: 14,
    fontWeight: "700",
  },

  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },

  submitButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 24,
  },
  submitLabel: {
    color: "#020617",
    fontSize: 15,
    fontWeight: "700",
  },
});
