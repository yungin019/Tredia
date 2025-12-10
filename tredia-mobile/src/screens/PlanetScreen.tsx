// src/screens/PlanetScreen.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

type CategoryKey = "all" | "crypto" | "stocks" | "forex" | "metals";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "crypto", label: "Crypto" },
  { key: "stocks", label: "Stocks" },
  { key: "forex", label: "Forex" },
  { key: "metals", label: "Metals" },
];

interface DashboardAsset {
  symbol: string;
  name?: string;
  price?: number;
  changePct?: number;
  assetClass?: string;
  aiBias?: string;
  aiConfidence?: number;
}

const normalizeClass = (cls?: string) =>
  cls ? cls.toLowerCase().trim() : "";

const PlanetScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [category, setCategory] = useState<CategoryKey>("all");

  // ------------- LOAD REAL SUPER AI DASHBOARD -------------
  const load = useCallback(async () => {
    try {
      setError(null);

      const res = await api.get("/ai/dashboard", {
        params: {
          heatmapLimit: 80,
          spotlightLimit: 10,
        },
      });

      setDashboard(res.data || {});
    } catch (e: any) {
      console.log("[PlanetScreen] load error", e?.message || e);
      setError("Failed to load live market data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  // ------------- SAFE EXTRACTED FIELDS -------------
  const rawSummary = dashboard?.summary ?? null;

  // summary can be:
  // - string (legacy)
  // - { title, text } (new AiDashboardPayload)
  // We normalize everything into a single summaryText string.
  let summaryText: string | undefined;
  if (typeof rawSummary === "string") {
    summaryText = rawSummary;
  } else if (rawSummary && typeof rawSummary === "object") {
    const maybeTitle =
      typeof (rawSummary as any).title === "string"
        ? (rawSummary as any).title
        : "";
    const maybeText =
      typeof (rawSummary as any).text === "string"
        ? (rawSummary as any).text
        : "";

    if (maybeTitle && maybeText) {
      summaryText = `${maybeTitle} — ${maybeText}`;
    } else {
      summaryText = maybeTitle || maybeText || undefined;
    }
  } else {
    summaryText = undefined;
  }

  const marketMood = dashboard?.marketMood ?? null;
  const moodLabel = marketMood?.label ?? "Neutral";
  const hotFocus = marketMood?.hotFocus ?? "BTC • ETH • Tech";
  const nextScan = marketMood?.nextScanText ?? "Every few minutes";

  const trending: DashboardAsset[] = dashboard?.trending ?? [];
  const heatmap: DashboardAsset[] = dashboard?.heatmap ?? [];

  // ------------- CATEGORY FILTERING -------------
  const categoryFilter = (a: DashboardAsset) => {
    if (category === "all") return true;

    const cls = normalizeClass(a.assetClass);
    if (!cls) return false;

    if (category === "crypto") return cls === "crypto";
    if (category === "stocks") return cls === "stock" || cls === "equity";
    if (category === "forex") return cls === "forex" || cls === "fx";
    if (category === "metals") return cls === "metal" || cls === "metals";

    return true;
  };

  const filteredTrending = useMemo(
    () => trending.filter(categoryFilter),
    [trending, category]
  );

  const filteredHeatmap = useMemo(
    () => heatmap.filter(categoryFilter).slice(0, 12),
    [heatmap, category]
  );

  // ------------- NAV -------------
  const goToAsset = (symbol: string) => {
    if (!symbol) return;
    navigation.navigate("AssetDetail", { symbol });
  };

  // ------------- LOADING / ERROR STATES -------------
  if (loading && !refreshing) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (error && !dashboard) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.textPrimary }}>{error}</Text>
        <TouchableOpacity
          onPress={load}
          style={[
            styles.retryBtn,
            { borderColor: theme.cardBorder },
          ]}
        >
          <Text style={{ color: theme.accent }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ------------- RENDER -------------
  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          MarketHub
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Explore, analyse & trade with Super AI.
        </Text>

        <View
          style={[
            styles.livePill,
            { borderColor: theme.accent },
          ]}
        >
          <View
            style={[
              styles.liveDot,
              { backgroundColor: theme.accent },
            ]}
          />
          <Text style={[styles.liveText, { color: theme.accent }]}>
            LIVE
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        {/* GLOBAL MOOD */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroLabel, { color: theme.textSoft }]}>
              Global mood
            </Text>

            <Text
              style={[
                styles.heroMood,
                { color: theme.accent },
              ]}
            >
              {moodLabel}
            </Text>

            {summaryText && (
              <Text
                style={[
                  styles.heroSummary,
                  { color: theme.textSoft },
                ]}
                numberOfLines={3}
              >
                {summaryText}
              </Text>
            )}

            <View style={{ marginTop: 6 }}>
              <Text
                style={[styles.heroMeta, { color: theme.textSoft }]}
              >
                Hot focus{" "}
                <Text style={{ color: theme.textPrimary }}>
                  {hotFocus}
                </Text>
              </Text>
              <Text
                style={[styles.heroMeta, { color: theme.textSoft }]}
              >
                Next AI scan{" "}
                <Text style={{ color: theme.textPrimary }}>
                  {nextScan}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.heroCircle,
              { borderColor: theme.accent },
            ]}
          />
        </View>

        {/* HEATMAP */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            AI Heatmap
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.textSoft },
            ]}
          >
            Where AI sees concentrated moves right now
          </Text>
        </View>

        {filteredHeatmap.length === 0 ? (
          <View
            style={[
              styles.empty,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={{ color: theme.textSoft, fontSize: 12 }}>
              No heatmap data available for this category.
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.heatmapGrid,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            {filteredHeatmap.map((a, idx) => {
              const pct = a.changePct ?? 0;
              const isUp = typeof pct === "number" && pct >= 0;

              const aiBias = normalizeClass(a.aiBias);
              let baseColor = theme.textSoft;

              if (aiBias === "bullish" || (aiBias === "" && isUp)) {
                baseColor = theme.success;
              } else if (
                aiBias === "bearish" ||
                (aiBias === "" && !isUp)
              ) {
                baseColor = theme.danger;
              }

              return (
                <TouchableOpacity
                  key={a.symbol + idx}
                  style={[
                    styles.heatTile,
                    {
                      borderColor: baseColor,
                      backgroundColor: baseColor + "22",
                    },
                  ]}
                  onPress={() => goToAsset(a.symbol)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.heatSymbol,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {a.symbol}
                  </Text>

                  <Text
                    style={[
                      styles.heatChange,
                      { color: baseColor },
                    ]}
                  >
                    {isUp ? "+" : ""}
                    {pct.toFixed(2)}%
                  </Text>

                  {typeof a.aiConfidence === "number" && (
                    <Text
                      style={[
                        styles.heatConfidence,
                        { color: theme.textSoft },
                      ]}
                    >
                      AI conf. {Math.round(a.aiConfidence)}%
                    </Text>
                  )}

                  {a.name && (
                    <Text
                      style={[
                        styles.heatName,
                        { color: theme.textSoft },
                      ]}
                      numberOfLines={1}
                    >
                      {a.name}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* CATEGORY PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pillsRow}
        >
          {CATEGORIES.map((cat) => {
            const active = cat.key === category;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setCategory(cat.key)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: active
                      ? theme.accent
                      : theme.surface,
                    borderColor: active
                      ? theme.accent
                      : theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: active ? "#020617" : theme.textSoft,
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* TRENDING */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Trending Today
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.textSoft },
            ]}
          >
            Assets with unusual momentum right now
          </Text>
        </View>

        {filteredTrending.length === 0 ? (
          <View
            style={[
              styles.empty,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text style={{ color: theme.textSoft, fontSize: 12 }}>
              No trending assets for this category.
            </Text>
          </View>
        ) : (
          filteredTrending.map((a, idx) => {
            const pct = a.changePct ?? 0;
            const isUp = pct >= 0;
            const color = isUp ? theme.success : theme.danger;

            return (
              <TouchableOpacity
                key={a.symbol + idx}
                style={[
                  styles.trendCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => goToAsset(a.symbol)}
              >
                <Text
                  style={[
                    styles.trendSymbol,
                    { color: theme.textPrimary },
                  ]}
                >
                  {a.symbol}
                </Text>

                <Text
                  style={[
                    styles.trendPct,
                    { color },
                  ]}
                >
                  {isUp ? "+" : ""}
                  {pct.toFixed(2)}%
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default PlanetScreen;

// ------------ STYLES ------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  retryBtn: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  livePill: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "600",
  },

  heroCard: {
    marginTop: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
  },
  heroLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  heroMood: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  heroSummary: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  heroMeta: {
    fontSize: 12,
  },
  heroCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    marginLeft: 12,
    marginTop: 6,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  empty: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  heatmapGrid: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  heatTile: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  heatSymbol: { fontSize: 16, fontWeight: "600" },
  heatChange: { fontSize: 14, marginTop: 4 },
  heatConfidence: { fontSize: 11, marginTop: 4 },
  heatName: { fontSize: 11, marginTop: 4 },

  pillsRow: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  pill: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  trendCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendSymbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  trendPct: {
    fontSize: 14,
    fontWeight: "600",
  },
});
