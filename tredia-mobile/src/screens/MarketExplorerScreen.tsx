// src/screens/MarketExplorerScreen.tsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import {
  fetchDailyBrief,
  fetchMarketMovers,
  fetchTrending,
  type MarketAsset,
} from "../services/marketService";
import MiniSparkline from "../components/charts/MiniSparkline";

type CategoryKey = "all" | "stocks" | "crypto" | "forex" | "metals" | "etf";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "stocks", label: "Stocks" },
  { key: "crypto", label: "Crypto" },
  { key: "forex", label: "Forex" },
  { key: "metals", label: "Gold & Metals" },
  { key: "etf", label: "ETFs" },
];

// ---- Local types to fix TS errors ----

type DailyBrief = {
  summary?: string | null;
  generatedAt?: string | null;
};

type ExtendedMarketAsset = MarketAsset & {
  assetClass?: string | null;
  sparkline?: number[];
  price?: number;
};

const MarketExplorerScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();

  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [movers, setMovers] = useState<ExtendedMarketAsset[]>([]);
  const [trending, setTrending] = useState<ExtendedMarketAsset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryKey>("all");

  // -------- LOAD DATA --------

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [briefRes, moversRes, trendingRes] = await Promise.all([
        fetchDailyBrief(),
        fetchMarketMovers(),
        fetchTrending(),
      ]);

      setBrief((briefRes as DailyBrief) || null);
      setMovers(
        ((moversRes as ExtendedMarketAsset[]) || []).map((m) => ({ ...m }))
      );
      setTrending(
        ((trendingRes as ExtendedMarketAsset[]) || []).map((t) => ({ ...t }))
      );
    } catch (e: any) {
      console.log("[MarketExplorer] load error:", e?.message || e);
      setError("Failed to load live market data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void load();
  }, [load]);

  // -------- FILTERING / DERIVED DATA --------

  const normalizeClass = (cls?: string | null) => (cls || "").toLowerCase();

  const filterByCategory = (
    assets: ExtendedMarketAsset[]
  ): ExtendedMarketAsset[] => {
    if (category === "all") return assets;

    return assets.filter((a) => {
      const cls = normalizeClass(a.assetClass);
      if (!cls) return false;

      if (category === "stocks") return cls === "stock" || cls === "equity";
      if (category === "crypto") return cls === "crypto" || cls === "coin";
      if (category === "forex") return cls === "forex" || cls === "fx";
      if (category === "metals") return cls === "metal" || cls === "metals";
      if (category === "etf") return cls === "etf" || cls === "fund";

      return true;
    });
  };

  const moversFiltered = useMemo(
    () => filterByCategory(movers),
    [movers, category]
  );
  const trendingFiltered = useMemo(
    () => filterByCategory(trending),
    [trending, category]
  );

  // 🔥 Ensure ranking really matches “Ranked by absolute move”
  const moversSorted = useMemo(
    () =>
      [...moversFiltered].sort(
        (a, b) =>
          Math.abs(b.changePct ?? 0) - Math.abs(a.changePct ?? 0)
      ),
    [moversFiltered]
  );

  const topSpotlight = moversSorted.slice(0, 4); // hero “AI Spotlight”
  const listRest = moversSorted.slice(4); // rest for “All movers”

  const upColor = theme.success ?? theme.positive ?? theme.accent;
  const downColor = theme.danger ?? theme.negative ?? theme.accent;

  const briefText =
    typeof brief?.summary === "string" && brief.summary.trim().length > 0
      ? brief.summary
      : "AI is watching live markets right now. As conditions change, this brief will highlight where attention, volatility and flows are concentrating today.";

  // -------- NAV HELPERS --------

  const openAsset = (symbol: string | undefined) => {
    if (!symbol) return;
    navigation.navigate("AssetDetail", { symbol });
  };

  // -------- RENDER --------

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={[styles.loadingLabel, { color: theme.textSoft }]}>
          Loading live markets…
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.accent}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Markets
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSoft }]}>
            AI-powered overview of global assets.
          </Text>
        </View>

        <View
          style={[
            styles.livePill,
            { borderColor: theme.accent, backgroundColor: theme.surfaceAlt },
          ]}
        >
          <View
            style={[
              styles.liveDot,
              { backgroundColor: theme.accent },
            ]}
          />
          <Text style={[styles.liveText, { color: theme.accent }]}>
            AI LIVE
          </Text>
        </View>
      </View>

      {/* AI DAILY BRIEF */}
      <View
        style={[
          styles.briefCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.briefHeaderRow}>
          <Text style={[styles.briefLabel, { color: theme.accent }]}>
            TREDIA AI · DAILY PULSE
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AI", {
                initialQuestion:
                  "Give me a calm, realistic overview of today’s market conditions.",
              })
            }
            style={[
              styles.briefAiButton,
              { borderColor: theme.cardBorder },
            ]}
          >
            <Ionicons
              name="sparkles-outline"
              size={14}
              color={theme.accent}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[styles.briefAiButtonText, { color: theme.textSoft }]}
            >
              Ask AI
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.briefText, { color: theme.textPrimary }]}>
          {briefText}
        </Text>

        {brief?.generatedAt && (
          <Text style={[styles.briefMeta, { color: theme.textSoft }]}>
            Updated {new Date(brief.generatedAt).toLocaleTimeString()}
          </Text>
        )}
      </View>

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
                  backgroundColor: active ? theme.accent : theme.surface,
                  borderColor: active ? theme.accent : theme.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? "#020617" : theme.textSoft },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* AI SPOTLIGHT (top movers) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          AI Spotlight
        </Text>
        <Text style={[styles.sectionCaption, { color: theme.textSoft }]}>
          Strongest moves & AI attention
        </Text>
      </View>

      {topSpotlight.length === 0 && !error && (
        <Text style={[styles.emptyText, { color: theme.textSoft }]}>
          No highlighted assets yet for this category.
        </Text>
      )}

      {topSpotlight.map((asset, idx) => {
        const change =
          typeof asset.changePct === "number" ? asset.changePct : 0;
        const isUp = change >= 0;
        const strokeColor = isUp ? upColor : downColor;
        const spark = Array.isArray(asset.sparkline)
          ? asset.sparkline
          : [];

        return (
          <TouchableOpacity
            key={`${asset.symbol}-spot-${idx}`}
            style={[
              styles.spotlightCard,
              {
                borderColor: strokeColor,
                backgroundColor: theme.surface,
              },
            ]}
            activeOpacity={0.9}
            onPress={() => openAsset(asset.symbol)}
          >
            <View style={styles.spotlightHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.assetSymbol, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {asset.symbol}
                </Text>
                {asset.name && (
                  <Text
                    style={[styles.assetName, { color: theme.textSoft }]}
                    numberOfLines={1}
                  >
                    {asset.name}
                  </Text>
                )}
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.spotlightChange,
                    { color: isUp ? upColor : downColor },
                  ]}
                >
                  {isUp ? "+" : ""}
                  {change.toFixed(2)}%
                </Text>
                {typeof asset.price === "number" && (
                  <Text
                    style={[
                      styles.spotlightPrice,
                      { color: theme.textSoft },
                    ]}
                  >
                    {asset.price.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>

            {spark.length > 0 && (
              <View style={styles.sparklineWrapper}>
                <MiniSparkline
                  data={spark}
                  width={260}
                  height={60}
                  strokeColor={strokeColor}
                />
              </View>
            )}

            <View style={styles.spotlightMetaRow}>
              <View
                style={[
                  styles.metaPill,
                  { borderColor: theme.cardBorder },
                ]}
              >
                <Text
                  style={[
                    styles.metaPillText,
                    { color: theme.textSoft },
                  ]}
                >
                  Rank #{idx + 1}
                </Text>
              </View>

              {asset.assetClass && (
                <View
                  style={[
                    styles.metaPill,
                    { borderColor: theme.cardBorder },
                  ]}
                >
                  <Text
                    style={[
                      styles.metaPillText,
                      { color: theme.textSoft },
                    ]}
                  >
                    {(asset.assetClass || "").toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* TRENDING TODAY – horizontal strip */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Trending today
        </Text>
        <Text style={[styles.sectionCaption, { color: theme.textSoft }]}>
          Names AI will keep an eye on
        </Text>
      </View>

      {trendingFiltered.length === 0 && !error && (
        <Text style={[styles.emptyText, { color: theme.textSoft }]}>
          No trending assets yet for this category.
        </Text>
      )}

      {trendingFiltered.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trendingRow}
        >
          {trendingFiltered.slice(0, 12).map((asset, idx) => {
            const change =
              typeof asset.changePct === "number" ? asset.changePct : 0;
            const isUp = change >= 0;

            return (
              <TouchableOpacity
                key={`${asset.symbol}-trend-${idx}`}
                style={[
                  styles.trendingCard,
                  {
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => openAsset(asset.symbol)}
              >
                <Text
                  style={[styles.trendingSymbol, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {asset.symbol}
                </Text>
                {asset.name && (
                  <Text
                    style={[styles.trendingName, { color: theme.textSoft }]}
                    numberOfLines={1}
                  >
                    {asset.name}
                  </Text>
                )}
                <Text
                  style={[
                    styles.trendingChange,
                    { color: isUp ? upColor : downColor },
                  ]}
                >
                  {isUp ? "+" : ""}
                  {change.toFixed(2)}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* ALL MOVERS – hybrid list (style C) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          All movers
        </Text>
        <Text style={[styles.sectionCaption, { color: theme.textSoft }]}>
          Ranked by absolute move
        </Text>
      </View>

      {moversSorted.length === 0 && !error && (
        <Text style={[styles.emptyText, { color: theme.textSoft }]}>
          No movers yet for this category.
        </Text>
      )}

      {listRest.map((asset, idx) => {
        const change =
          typeof asset.changePct === "number" ? asset.changePct : 0;
        const isUp = change >= 0;
        const strokeColor = isUp ? upColor : downColor;
        const spark = Array.isArray(asset.sparkline)
          ? asset.sparkline
          : [];

        return (
          <TouchableOpacity
            key={`${asset.symbol}-row-${idx}`}
            style={[
              styles.assetRow,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
            onPress={() => openAsset(asset.symbol)}
          >
            <View style={styles.assetRowLeft}>
              <Text
                style={[styles.assetRowSymbol, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {asset.symbol}
              </Text>
              <Text
                style={[styles.assetRowMeta, { color: theme.textSoft }]}
                numberOfLines={1}
              >
                {asset.name ?? "—"}
              </Text>
            </View>

            {/* subtle glow bar or sparkline on the right */}
            <View style={styles.assetRowMiddle}>
              {spark.length > 0 ? (
                <MiniSparkline
                  data={spark}
                  width={90}
                  height={40}
                  strokeColor={strokeColor}
                />
              ) : (
                <View
                  style={[
                    styles.glowBarTrack,
                    { backgroundColor: theme.surfaceAlt },
                  ]}
                >
                  <View
                    style={[
                      styles.glowBarFill,
                      {
                        backgroundColor: strokeColor,
                        width: `${Math.min(
                          100,
                          Math.max(8, Math.abs(change))
                        )}%` as any,
                      },
                    ]}
                  />
                </View>
              )}
            </View>

            <View style={styles.assetRowRight}>
              <Text
                style={[
                  styles.assetRowChange,
                  { color: isUp ? upColor : downColor },
                ]}
              >
                {isUp ? "+" : ""}
                {change.toFixed(2)}%
              </Text>
              {typeof asset.price === "number" && (
                <Text
                  style={[
                    styles.assetRowPrice,
                    { color: theme.textSoft },
                  ]}
                >
                  {asset.price.toFixed(2)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {error && (
        <Text style={[styles.errorText, { color: theme.danger }]}>
          {error}
        </Text>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
};

export default MarketExplorerScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLabel: {
    marginTop: 8,
    fontSize: 13,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 4,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // AI brief
  briefCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  briefHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  briefLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  briefAiButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  briefAiButtonText: {
    fontSize: 11,
    fontWeight: "500",
  },
  briefText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  briefMeta: {
    fontSize: 11,
    marginTop: 2,
  },

  // Category pills
  pillsRow: {
    marginTop: 4,
    marginBottom: 14,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  // Sections
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  sectionCaption: {
    fontSize: 11,
  },
  emptyText: {
    fontSize: 12,
    marginBottom: 10,
  },

  // Spotlight
  spotlightCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  spotlightHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  spotlightChange: {
    fontSize: 16,
    fontWeight: "700",
  },
  spotlightPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  sparklineWrapper: {
    marginTop: 8,
    marginBottom: 6,
    alignItems: "center",
  },
  spotlightMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  metaPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Trending horizontal
  trendingRow: {
    marginBottom: 12,
  },
  trendingCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    minWidth: 120,
  },
  trendingSymbol: {
    fontSize: 14,
    fontWeight: "700",
  },
  trendingName: {
    fontSize: 11,
    marginTop: 2,
  },
  trendingChange: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
  },

  // Asset rows – hybrid style C
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  assetRowLeft: {
    flex: 1.3,
  },
  assetRowMiddle: {
    flex: 1.1,
    alignItems: "center",
    justifyContent: "center",
  },
  assetRowRight: {
    flex: 0.7,
    alignItems: "flex-end",
  },
  assetRowSymbol: {
    fontSize: 15,
    fontWeight: "600",
  },
  assetRowMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  glowBarTrack: {
    width: 90,
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  glowBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  assetRowChange: {
    fontSize: 14,
    fontWeight: "700",
  },
  assetRowPrice: {
    fontSize: 12,
    marginTop: 2,
  },

  // Generic asset text reused
  assetSymbol: {
    fontSize: 16,
    fontWeight: "700",
  },
  assetName: {
    fontSize: 12,
    marginTop: 2,
  },

  errorText: {
    fontSize: 12,
    marginTop: 10,
  },
});
