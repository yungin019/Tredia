// src/screens/TrendsScreen.tsx

import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import { fetchTrending, type MarketAsset } from "../services/marketService";
import type { RootStackParamList } from "../navigation/RootNavigator";

type AssetDetailNav = NativeStackNavigationProp<
  RootStackParamList,
  "AssetDetail"
>;

type TrendCategory = "ALL" | "CRYPTO" | "STOCKS" | "FOREX" | "METALS" | "ETF";

export default function TrendsScreen() {
  const theme: any = useTheme();
  const navigation = useNavigation<AssetDetailNav>();

  const [category, setCategory] = useState<TrendCategory>("ALL");
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<MarketAsset[]>([]);

  const CATEGORIES: TrendCategory[] = [
    "ALL",
    "CRYPTO",
    "STOCKS",
    "FOREX",
    "METALS",
    "ETF",
  ];

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchTrending().catch(() => []);
      setTrends(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log("TrendsScreen error", e);
      setTrends([]);
    } finally {
      setLoading(false);
    }
  }

  const normalizeClass = (cls?: string | null) =>
    (cls || "").toLowerCase();

  const filteredTrends = useMemo(() => {
    if (category === "ALL") return trends;

    return trends.filter((t) => {
      const cls = normalizeClass((t as any).assetClass);
      if (!cls) return false;

      if (category === "CRYPTO") return cls === "crypto" || cls === "coin";
      if (category === "STOCKS") return cls === "stock" || cls === "equity";
      if (category === "FOREX") return cls === "forex" || cls === "fx";
      if (category === "METALS") return cls === "metal" || cls === "metals";
      if (category === "ETF") return cls === "etf" || cls === "fund";

      return true;
    });
  }, [category, trends]);

  const handleOpenAsset = (symbol: string | undefined) => {
    if (!symbol) return;
    navigation.navigate("AssetDetail", { symbol });
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Market Trends
      </Text>

      <View style={styles.tabsRow}>
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={[
                styles.tab,
                {
                  backgroundColor: active
                    ? theme.primary ?? theme.accent
                    : theme.surfaceGlass ?? theme.surface,
                  borderColor: active
                    ? theme.primary ?? theme.accent
                    : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? "white" : theme.textSoft,
                  fontWeight: "700",
                }}
              >
                {c}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.accent}
          style={{ marginTop: 30 }}
        />
      ) : filteredTrends.length === 0 ? (
        <Text
          style={{
            marginTop: 20,
            color: theme.textSoft,
            fontSize: 13,
          }}
        >
          No trends available for this category right now.
        </Text>
      ) : (
        filteredTrends.map((t, i) => {
          const change =
            typeof t.changePct === "number" ? t.changePct : 0;
          const isUp = change >= 0;
          const price =
            typeof (t as any).price === "number"
              ? (t as any).price
              : undefined;

          return (
            <TouchableOpacity
              key={t.symbol ?? i}
              onPress={() => handleOpenAsset(t.symbol)}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surfaceGlass ?? theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text
                  style={[styles.symbol, { color: theme.textPrimary }]}
                >
                  {t.symbol}
                </Text>
                <Text
                  style={{
                    fontWeight: "700",
                    color: isUp ? theme.success : theme.danger,
                  }}
                >
                  {isUp ? "+" : ""}
                  {change.toFixed(2)}%
                </Text>
              </View>

              {!!t.name && (
                <Text style={{ color: theme.textSoft, fontSize: 12 }}>
                  {t.name}
                </Text>
              )}

              {typeof price === "number" && (
                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 17,
                    fontWeight: "700",
                    color: theme.accent,
                  }}
                >
                  ${price.toFixed(2)}
                </Text>
              )}

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: theme.textSoft,
                }}
              >
                Tap to open full asset page →
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "800", marginBottom: 20 },
  tabsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "700",
  },
});
