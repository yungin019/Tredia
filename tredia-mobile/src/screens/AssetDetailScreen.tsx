// src/screens/AssetDetailScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { api } from "../services/api";
import MiniSparkline from "../components/charts/MiniSparkline";
import useTradeModal from "../hooks/useTradeModal";
import NeonButton from "../components/NeonButton";

type Props = NativeStackScreenProps<RootStackParamList, "AssetDetail">;

type AssetInfo = {
  symbol: string;
  name?: string | null;
  price?: number | null;
  changePct?: number | null;
  changeAbs?: number | null;
  currency?: string | null;
  marketCap?: number | null;
  volume24h?: number | null;
  open?: number | null;
  high?: number | null;
  low?: number | null;
  prevClose?: number | null;
  exchange?: string | null;
  assetType?: string | null;
};

type Candle = {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number | null;
};

// ---- Super AI news sentiment (same shape as AlertsScreen) ----

type SentimentLabel = "bullish" | "bearish" | "neutral";

type NewsSentiment = {
  id: string;
  title: string;
  summary: string | null;
  sentimentLabel: SentimentLabel;
  sentimentScore: number; // -1 to 1
  impactScore: number; // 0–100
  impactedSymbols: string[];
  horizon: "intraday" | "swing" | "position";
  confidence: number; // 0–1
  source?: string | null;
  url?: string | null;
  publishedAt?: string | null;
  categories?: string[];
  aiComment?: string | null;
};

type AiDashboardNewsPayload = {
  // new backend shape
  newsRadar?: NewsSentiment[];
  // older/demo shape
  newsSentiment?: NewsSentiment[];
};

// --------------------------------------------------------------

const AssetDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { symbol } = route.params;
  const theme: any = useTheme();

  const { openTradeModal, TradeModalElement } = useTradeModal();

  const [info, setInfo] = useState<AssetInfo | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [newsImpact, setNewsImpact] = useState<NewsSentiment[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      // --- 1) LIVE ASSET INFO ---
      const infoRes = await api.get(
        `/markets/info/${encodeURIComponent(symbol)}`
      );

      const infoPayload = infoRes.data?.info ?? infoRes.data ?? {};
      const normalizedInfo: AssetInfo = {
        symbol: infoPayload.symbol ?? symbol,
        name: infoPayload.name ?? infoPayload.companyName ?? null,
        price:
          typeof infoPayload.price === "number"
            ? infoPayload.price
            : typeof infoPayload.last === "number"
            ? infoPayload.last
            : null,
        changePct:
          typeof infoPayload.changePct === "number"
            ? infoPayload.changePct
            : typeof infoPayload.percentChange === "number"
            ? infoPayload.percentChange
            : null,
        changeAbs:
          typeof infoPayload.changeAbs === "number"
            ? infoPayload.changeAbs
            : typeof infoPayload.change === "number"
            ? infoPayload.change
            : null,
        currency: infoPayload.currency ?? infoPayload.curr ?? null,
        marketCap: infoPayload.marketCap ?? null,
        volume24h: infoPayload.volume24h ?? infoPayload.volume ?? null,
        open: infoPayload.open ?? null,
        high: infoPayload.high ?? null,
        low: infoPayload.low ?? null,
        prevClose: infoPayload.prevClose ?? infoPayload.previousClose ?? null,
        exchange: infoPayload.exchange ?? null,
        assetType: infoPayload.assetType ?? infoPayload.type ?? null,
      };

      setInfo(normalizedInfo);

      // --- 2) LIVE OHLC CANDLES ---
      const ohlcRes = await api.get(
        `/markets/ohlc/${encodeURIComponent(symbol)}`
      );

      const raw = ohlcRes.data;
      const candleArray: Candle[] = Array.isArray(raw?.candles)
        ? raw.candles
        : Array.isArray(raw)
        ? raw
        : [];

      const cleanedCandles: Candle[] = candleArray
        .filter(
          (c) =>
            c &&
            typeof c.open === "number" &&
            typeof c.high === "number" &&
            typeof c.low === "number" &&
            typeof c.close === "number"
        )
        .map((c) => ({
          time: c.time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
          volume: c.volume ?? null,
        }));

      setCandles(cleanedCandles);
    } catch (e: any) {
      console.log("[AssetDetail] load price/ohlc error", e?.message || e);
      setError("Failed to load live market data for this asset.");
    }

    // --- 3) SUPER AI NEWS IMPACT (non-blocking) ---
    try {
      const dashRes = await api.get<AiDashboardNewsPayload>("/ai/dashboard", {
        params: {
          newsLimit: 30,
        },
      });

      const rawNews =
        dashRes.data?.newsSentiment ?? dashRes.data?.newsRadar ?? [];
      const allNews: NewsSentiment[] = Array.isArray(rawNews) ? rawNews : [];

      const byAsset = allNews.filter(
        (n) =>
          Array.isArray(n.impactedSymbols) &&
          n.impactedSymbols.includes(symbol)
      );

      // Take top 4 with highest impact score
      const sorted = [...byAsset].sort(
        (a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0)
      );
      setNewsImpact(sorted.slice(0, 4));
    } catch (e: any) {
      console.log("[AssetDetail] load news impact error", e?.message || e);
      // Don’t surface error to user here – asset data is the priority.
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [symbol]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    void load();
  };

  const sparklineData =
    candles.length > 0 ? candles.map((c) => c.close) : [];

  const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;

  const price = info?.price ?? null;
  const changePct = info?.changePct ?? null;
  const changeAbs = info?.changeAbs ?? null;
  const isUp = changePct !== null && changePct >= 0;

  const formatNumber = (
  value: number | null | undefined,
  decimals = 2 // ✅ correct name
): string => {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toFixed(decimals); // ✅ use "decimals" here
};


  const formatBig = (value: number | null | undefined): string => {
    if (!value && value !== 0) return "—";
    if (value >= 1_000_000_000)
      return (value / 1_000_000_000).toFixed(1) + " B";
    if (value >= 1_000_000)
      return (value / 1_000_000).toFixed(1) + " M";
    if (value >= 1_000)
      return (value / 1_000).toFixed(1) + " K";
    return value.toFixed(0);
  };

  const hasNewsImpact = newsImpact.length > 0;

  const horizonLabel = (h: NewsSentiment["horizon"]): string => {
    if (h === "intraday") return "0–24h";
    if (h === "position") return "Weeks+";
    return "1–7 days";
  };

  if (loading && !info) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        {/* BACK BUTTON */}
        <View style={styles.backRow}>
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
              style={[
                styles.backButtonText,
                { color: theme.textSoft },
              ]}
            >
              ← Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text
              style={[styles.symbol, { color: theme.textPrimary }]}
            >
              {info?.symbol ?? symbol}
            </Text>
            {!!info?.name && (
              <Text
                style={[styles.name, { color: theme.textSoft }]}
              >
                {info.name}
              </Text>
            )}
          </View>

          <View style={styles.tagCol}>
            {!!info?.assetType && (
              <View
                style={[
                  styles.tag,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: theme.textSoft },
                  ]}
                >
                  {info.assetType}
                </Text>
              </View>
            )}
            {!!info?.exchange && (
              <Text
                style={[
                  styles.exchange,
                  { color: theme.textSoft },
                ]}
              >
                {info.exchange}
              </Text>
            )}
          </View>
        </View>

        {/* PRICE BLOCK */}
        <View style={styles.priceRow}>
          <View>
            <Text
              style={[styles.price, { color: theme.textPrimary }]}
            >
              {price !== null
                ? `${price.toFixed(2)}${
                    info?.currency ? " " + info.currency : ""
                  }`
                : "—"}
            </Text>
            <View style={styles.changeRow}>
              <Text
                style={[
                  styles.changeText,
                  {
                    color:
                      changePct === null
                        ? theme.textSoft
                        : isUp
                        ? theme.success
                        : theme.danger,
                  },
                ]}
              >
                {changePct === null
                  ? "—"
                  : `${isUp ? "+" : ""}${changePct.toFixed(2)}%`}
              </Text>
              {changeAbs !== null && (
                <Text
                  style={[
                    styles.changeAbs,
                    { color: theme.textSoft },
                  ]}
                >
                  {`${changeAbs >= 0 ? "+" : ""}${changeAbs.toFixed(2)}`}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* CHART CARD – LIVE CANDLES (SPARKLINE) */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[styles.cardTitle, { color: theme.textPrimary }]}
            >
              Price action
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: theme.textSoft }]}
            >
              Live candles • Last sessions
            </Text>
          </View>

          {loading && sparklineData.length === 0 ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color={theme.accent} />
              <Text
                style={[
                  styles.loaderText,
                  { color: theme.textSoft },
                ]}
              >
                Loading live OHLC data…
              </Text>
            </View>
          ) : sparklineData.length === 0 ? (
            <Text
              style={[styles.emptyText, { color: theme.textSoft }]}
            >
              No candle data available yet for this asset.
            </Text>
          ) : (
            <View style={styles.sparklineWrapper}>
              <MiniSparkline
                data={sparklineData}
                strokeColor={isUp ? theme.success : theme.danger}
                width={260}
                height={80}
              />
            </View>
          )}

          {/* Small OHLC snapshot from latest candle */}
          {lastCandle && (
            <View style={styles.ohlcRow}>
              <View style={styles.ohlcCol}>
                <Text
                  style={[
                    styles.ohlcLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Open
                </Text>
                <Text
                  style={[
                    styles.ohlcValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {formatNumber(lastCandle.open)}
                </Text>
              </View>
              <View style={styles.ohlcCol}>
                <Text
                  style={[
                    styles.ohlcLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  High
                </Text>
                <Text
                  style={[
                    styles.ohlcValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {formatNumber(lastCandle.high)}
                </Text>
              </View>
              <View style={styles.ohlcCol}>
                <Text
                  style={[
                    styles.ohlcLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Low
                </Text>
                <Text
                  style={[
                    styles.ohlcValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {formatNumber(lastCandle.low)}
                </Text>
              </View>
              <View style={styles.ohlcCol}>
                <Text
                  style={[
                    styles.ohlcLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Close
                </Text>
                <Text
                  style={[
                    styles.ohlcValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {formatNumber(lastCandle.close)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* STATS CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[styles.cardTitle, { color: theme.textPrimary }]}
            >
              Stats
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: theme.textSoft }]}
            >
              Live snapshot from your data provider
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text
                style={[styles.statLabel, { color: theme.textSoft }]}
              >
                Day high
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
              >
                {formatNumber(info?.high)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                style={[styles.statLabel, { color: theme.textSoft }]}
              >
                Day low
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
              >
                {formatNumber(info?.low)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                style={[styles.statLabel, { color: theme.textSoft }]}
              >
                Open
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
              >
                {formatNumber(info?.open)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                style={[styles.statLabel, { color: theme.textSoft }]}
              >
                Prev. close
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
              >
                {formatNumber(info?.prevClose)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                style={[styles.statLabel, { color: theme.textSoft }]}
              >
                Volume
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
              >
                {formatBig(info?.volume24h ?? null)}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text
                style={[styles.statLabel, { color: theme.textSoft }]}
              >
                Market cap
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
              >
                {formatBig(info?.marketCap ?? null)}
              </Text>
            </View>
          </View>
        </View>

        {/* NEWS IMPACT CARD */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[styles.cardTitle, { color: theme.textPrimary }]}
            >
              News impact on {symbol}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: theme.textSoft }]}
            >
              Super AI sentiment · impact score · time horizon
            </Text>
          </View>

          {!hasNewsImpact && (
            <Text
              style={[styles.emptyText, { color: theme.textSoft }]}
            >
              Super AI doesn&apos;t see any strong, focused news cluster on{" "}
              {symbol} right now. When a story directly affects this asset, it
              will appear here with sentiment, impact and horizon.
            </Text>
          )}

          {newsImpact.map((n) => {
            const badgeColor =
              n.sentimentLabel === "bullish"
                ? theme.success
                : n.sentimentLabel === "bearish"
                ? theme.danger
                : theme.accent;

            const badgeText =
              n.sentimentLabel === "bullish"
                ? "Bullish"
                : n.sentimentLabel === "bearish"
                ? "Bearish"
                : "Neutral";

            const impactScore = Math.round(n.impactScore ?? 0);
            const confidencePct = Math.round((n.confidence ?? 0) * 100);

            return (
              <View
                key={n.id}
                style={[
                  styles.newsImpactCard,
                  {
                    borderColor: theme.cardBorder,
                    backgroundColor: theme.surfaceAlt,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.newsImpactTag,
                    { color: badgeColor, borderColor: badgeColor },
                  ]}
                >
                  {badgeText.toUpperCase()} • Impact {impactScore}/100
                </Text>

                <Text
                  style={[
                    styles.newsImpactTitle,
                    { color: theme.textPrimary },
                  ]}
                  numberOfLines={2}
                >
                  {n.title}
                </Text>

                <Text
                  style={[
                    styles.newsImpactBody,
                    { color: theme.textSoft },
                  ]}
                  numberOfLines={3}
                >
                  {n.aiComment && n.aiComment.trim().length > 0
                    ? n.aiComment
                    : n.summary ||
                      "AI is still parsing this story and its implications."}
                </Text>

                <View style={styles.newsImpactFooterRow}>
                  <Text
                    style={[
                      styles.newsImpactFooterText,
                      { color: theme.textSoft },
                    ]}
                  >
                    Horizon: {horizonLabel(n.horizon)}
                  </Text>
                  <Text
                    style={[
                      styles.newsImpactFooterText,
                      { color: theme.textSoft },
                    ]}
                  >
                    AI conf. {confidencePct}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* AI CTA */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[styles.cardTitle, { color: theme.textPrimary }]}
            >
              Ask Tredia AI about {symbol}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: theme.textSoft }]}
            >
              Get structured, realistic analysis — no hype, no memes.
            </Text>
          </View>

          <Text
            style={[styles.aiHint, { color: theme.textSoft }]}
          >
            You&apos;re seeing live price, candles and news impact above.
            {"\n"}
            For real coaching, ask Tredia AI things like:
            {"\n"}• “Is {symbol} too risky to hold right now?”
            {"\n"}• “What&apos;s a sane position size for {symbol}?”
            {"\n"}• “Help me build a plan around this ticker.”
          </Text>

          <TouchableOpacity
            style={[
              styles.aiButton,
              { backgroundColor: theme.accent },
            ]}
            onPress={() =>
              navigation.navigate("HomeTabs", {
                screen: "AI",
                params: {
                  initialQuestion: `Give me a calm, realistic view on ${symbol}.`,
                },
              } as any)
            }
          >
            <Text style={styles.aiButtonText}>
              Open Tredia AI chat
            </Text>
          </TouchableOpacity>
        </View>

        {/* TRADE CARD + BUTTON */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text
              style={[styles.cardTitle, { color: theme.textPrimary }]}
            >
              Trade {symbol}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: theme.textSoft }]}
            >
              Simulate a position in your paper portfolio before
              risking real money.
            </Text>
          </View>

          <NeonButton
            label={`Trade ${symbol}`}
            onPress={() => openTradeModal(symbol)}
            glowColor={theme.accent}
          />
        </View>

        {error && (
          <Text
            style={[
              styles.errorText,
              { color: theme.danger },
            ]}
          >
            {error}
          </Text>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {TradeModalElement}
    </View>
  );
};

export default AssetDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // BACK
  backRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  backButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  symbol: {
    fontSize: 26,
    fontWeight: "800",
  },
  name: {
    fontSize: 13,
    marginTop: 4,
  },
  tagCol: {
    alignItems: "flex-end",
  },
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  exchange: {
    fontSize: 11,
  },

  // PRICE
  priceRow: {
    marginBottom: 14,
  },
  price: {
    fontSize: 30,
    fontWeight: "800",
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 4,
  },
  changeText: {
    fontSize: 16,
    fontWeight: "700",
  },
  changeAbs: {
    fontSize: 13,
  },

  // GENERIC CARD
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginTop: 10,
  },
  cardHeaderRow: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },

  loaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  loaderText: {
    fontSize: 12,
  },
  emptyText: {
    fontSize: 12,
    marginTop: 8,
  },

  // CHART
  sparklineWrapper: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  ohlcRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  ohlcCol: {
    flex: 1,
    alignItems: "flex-start",
  },
  ohlcLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  ohlcValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  // STATS
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  statItem: {
    width: "50%",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  // NEWS IMPACT
  newsImpactCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    marginTop: 8,
  },
  newsImpactTag: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  newsImpactTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  newsImpactBody: {
    fontSize: 12,
    marginBottom: 6,
  },
  newsImpactFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newsImpactFooterText: {
    fontSize: 11,
  },

  // AI SECTION
  aiHint: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  aiButton: {
    marginTop: 10,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  aiButtonText: {
    color: "#020617",
    fontSize: 14,
    fontWeight: "700",
  },

  // ERROR
  errorText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "center",
  },
});
