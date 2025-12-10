// src/screens/PortfolioScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import TradeModal from "../components/TradeModal";
import GlowView from "../components/GlowView";

// --------- BACKEND RESPONSE TYPES ---------

interface PaperPortfolio {
  id: number;
  userId: number;
  startingCash: number;
  cash: number;
  baseCurrency: string;
}

interface PaperTrade {
  id: number;
  userId: number;
  paperPortfolioId: number;
  symbol: string;
  assetType: string;
  side: "BUY" | "SELL" | string;
  size: number;
  quantity: number;
  entryPrice: number;
  exitPrice?: number | null;
  status: string; // "OPEN" | "CLOSED" etc.
  createdAt: string;
  updatedAt: string;
}

interface PortfolioApiResponse {
  portfolio: PaperPortfolio;
  trades: PaperTrade[];
}

interface PaperPerformanceResponse {
  portfolio: {
    id: number;
    userId: number;
    startingCash: number;
    currentCash: number;
    baseCurrency: string;
  };
  performance: {
    totalTrades: number;
    openTrades: number;
    closedTrades: number;
    realizedPnl: number;
    invested: number;
  };
}

// --------- DERIVED POSITION FOR UI ---------

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number | null;
  marketValue: number;
  unrealizedPnl: number;
}

// --------- SCREEN ---------

const PortfolioScreen: React.FC = () => {
  const theme: any = useTheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [portfolio, setPortfolio] = useState<PaperPortfolio | null>(null);
  const [performance, setPerformance] =
    useState<PaperPerformanceResponse | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  const [tradeVisible, setTradeVisible] = useState<boolean>(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  // --------- LOAD & BUILD POSITIONS ---------

  const fetchPortfolio = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      // 1) Load raw portfolio + raw trades
      const [portfolioRes, perfRes] = await Promise.all([
        api.get<PortfolioApiResponse>("/paper/portfolio"),
        api.get<PaperPerformanceResponse>("/paper/performance"),
      ]);

      const portfolioData = portfolioRes.data?.portfolio;
      const trades = portfolioRes.data?.trades || [];
      const perfData = perfRes.data;

      setPortfolio(portfolioData);
      setPerformance(perfData);

      // 2) Consider only OPEN trades to build positions
      const openTrades = trades.filter(
        (t) => t.status === "OPEN" || t.status === "open"
      );

      const symbols = Array.from(
        new Set(openTrades.map((t) => t.symbol).filter(Boolean))
      );

      // 3) Fetch live price for each symbol
      const priceMap: Record<string, number | null> = {};

      await Promise.all(
        symbols.map(async (sym) => {
          try {
            const infoRes = await api.get(
              `/markets/info/${encodeURIComponent(sym)}`
            );
            const infoPayload = infoRes.data?.info ?? infoRes.data ?? {};
            const price =
              typeof infoPayload.price === "number"
                ? infoPayload.price
                : typeof infoPayload.last === "number"
                ? infoPayload.last
                : typeof infoPayload.c === "number"
                ? infoPayload.c
                : null;
            priceMap[sym] = price;
          } catch (err) {
            console.log("[Portfolio] live price error for", sym, err);
            priceMap[sym] = null;
          }
        })
      );

      // 4) Aggregate trades → positions per symbol
      const derivedPositions: Position[] = symbols
        .map((sym) => {
          const symTrades = openTrades.filter((t) => t.symbol === sym);

          // Net quantity (buy positive, sell negative)
          let netQty = 0;
          let cost = 0;

          for (const t of symTrades) {
            const sign = t.side === "SELL" ? -1 : 1;
            netQty += sign * t.quantity;
            cost += sign * t.quantity * t.entryPrice;
          }

          if (Math.abs(netQty) < 1e-6) {
            // Net flat; skip zero positions
            return null as any;
          }

          const avgPrice = cost / netQty;
          const currentPrice = priceMap[sym] ?? null;

          const marketValue =
            currentPrice !== null ? currentPrice * netQty : avgPrice * netQty;

          const basis = avgPrice * netQty;
          const unrealizedPnl = marketValue - basis;

          return {
            symbol: sym,
            quantity: netQty,
            avgPrice,
            currentPrice,
            marketValue,
            unrealizedPnl,
          };
        })
        .filter(Boolean) as Position[];

      // Sort positions by market value desc
      derivedPositions.sort((a, b) => b.marketValue - a.marketValue);

      setPositions(derivedPositions);
    } catch (err: any) {
      console.log("[Portfolio] load error:", err?.message || err);
      setError("Failed to load portfolio.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchPortfolio();
  }, [fetchPortfolio]);

  const onRefresh = () => {
    setRefreshing(true);
    void fetchPortfolio();
  };

  const openTrade = (symbol: string) => {
    if (!symbol) return;
    setSelectedSymbol(symbol);
    setTradeVisible(true);
  };

  // --------- DERIVED METRICS FOR UI ---------

  const cash =
    portfolio?.cash ?? performance?.portfolio.currentCash ?? 0;

  const startingCash =
    portfolio?.startingCash ?? performance?.portfolio.startingCash ?? 0;

  const baseCurrency =
    portfolio?.baseCurrency ?? performance?.portfolio.baseCurrency ?? "USD";

  const investedValue =
    positions.reduce((sum, p) => sum + p.marketValue, 0) || 0;

  const totalEquity = cash + investedValue;
  const pnl = totalEquity - startingCash;
  const pnlPct = startingCash > 0 ? (pnl / startingCash) * 100 : 0;

  const realizedPnl = performance?.performance.realizedPnl ?? 0;
  const totalTrades = performance?.performance.totalTrades ?? 0;
  const openTrades = performance?.performance.openTrades ?? 0;
  const closedTrades = performance?.performance.closedTrades ?? 0;

  const pnlColor =
    pnl > 0
      ? theme.success ?? theme.accent
      : pnl < 0
      ? theme.danger ?? theme.accent
      : theme.textSoft;

  const investedShare =
    totalEquity > 0
      ? Math.min(100, Math.max(0, (investedValue / totalEquity) * 100))
      : 0;

  const winningPositions = positions.filter(
    (p) => p.unrealizedPnl > 0
  ).length;
  const losingPositions = positions.filter(
    (p) => p.unrealizedPnl < 0
  ).length;

  // --------- LOADING / ERROR STATES ---------

  if (loading && !refreshing) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  if (error && !portfolio && !performance) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.textPrimary }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchPortfolio}
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

  // --------- UI ---------

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Portfolio
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Paper trading cockpit
        </Text>

        <View
          style={[
            styles.modePill,
            {
              borderColor: theme.accent,
            },
          ]}
        >
          <View
            style={[
              styles.liveDot,
              { backgroundColor: theme.accent },
            ]}
          />
          <Text
            style={[styles.modeText, { color: theme.accent }]}
          >
            Paper account · {baseCurrency}
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
        {/* EQUITY HERO – GLOW CARD */}
        <GlowView intensity="medium" radius={22} style={{ marginTop: 4 }}>
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
              <View>
                <Text
                  style={[
                    styles.cardLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Total equity
                </Text>
                <Text
                  style={[
                    styles.equityValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {totalEquity.toFixed(2)} {baseCurrency}
                </Text>
              </View>

              <View
                style={[
                  styles.pnlPill,
                  {
                    borderColor: pnlColor,
                    backgroundColor: `${pnlColor}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pnlPillText,
                    { color: pnlColor },
                  ]}
                >
                  {pnl >= 0 ? "▲" : "▼"} {pnl >= 0 ? "+" : ""}
                  {pnl.toFixed(2)} {baseCurrency} (
                  {pnlPct.toFixed(2)}%)
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.cardLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Cash
                </Text>
                <Text
                  style={[
                    styles.cardValueSmall,
                    { color: theme.textPrimary },
                  ]}
                >
                  {cash.toFixed(2)} {baseCurrency}
                </Text>
              </View>
              <View style={styles.col}>
                <Text
                  style={[
                    styles.cardLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Invested
                </Text>
                <Text
                  style={[
                    styles.cardValueSmall,
                    { color: theme.textPrimary },
                  ]}
                >
                  {investedValue.toFixed(2)} {baseCurrency}
                </Text>
              </View>
            </View>

            {/* ALLOCATION BAR */}
            <View style={styles.allocWrapper}>
              <View
                style={[
                  styles.allocTrack,
                  { backgroundColor: theme.cardBorder },
                ]}
              >
                <View
                  style={[
                    styles.allocFill,
                    {
                      width: `${investedShare}%`,
                      backgroundColor: theme.accent,
                    },
                  ]}
                />
              </View>
              <View style={styles.allocLabelsRow}>
                <Text
                  style={[
                    styles.allocLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  {investedShare.toFixed(0)}% invested
                </Text>
                <Text
                  style={[
                    styles.allocLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  {positions.length} position
                  {positions.length === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          </View>
        </GlowView>

        {/* PERFORMANCE SUMMARY */}
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.textPrimary },
            ]}
          >
            Performance
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.textSoft },
            ]}
          >
            Based on your paper trades history
          </Text>
        </View>

        <View style={styles.perfRow}>
          <View
            style={[
              styles.perfCard,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.perfLabel,
                { color: theme.textSoft },
              ]}
            >
              Realized P&L
            </Text>
            <Text
              style={[
                styles.perfValue,
                {
                  color:
                    realizedPnl > 0
                      ? theme.success
                      : realizedPnl < 0
                      ? theme.danger
                      : theme.textPrimary,
                },
              ]}
            >
              {realizedPnl >= 0 ? "+" : ""}
              {realizedPnl.toFixed(2)} {baseCurrency}
            </Text>
          </View>

          <View
            style={[
              styles.perfCard,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.perfLabel,
                { color: theme.textSoft },
              ]}
            >
              Trades
            </Text>
            <Text
              style={[
                styles.perfValue,
                { color: theme.textPrimary },
              ]}
            >
              {totalTrades} total · {openTrades} open ·{" "}
              {closedTrades} closed
            </Text>
          </View>
        </View>

        {/* PORTFOLIO SUMMARY */}
        <View style={styles.sectionHeaderInner}>
          <Text
            style={[
              styles.sectionTitleSm,
              { color: theme.textPrimary },
            ]}
          >
            Positions
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: theme.textSoft },
            ]}
          >
            Wins: {winningPositions} · Losses: {losingPositions} ·
            Open positions: {positions.length}
          </Text>
          <Text
            style={[
              styles.sectionHint,
              { color: theme.textSoft },
            ]}
          >
            Tap a position to open the trade panel.
          </Text>
        </View>

        {/* POSITIONS LIST */}
        {positions.length === 0 ? (
          <View
            style={[
              styles.empty,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text
              style={{ color: theme.textSoft, fontSize: 12 }}
            >
              No open positions yet. Start simulating trades from any
              asset, then your positions will appear here with live
              P&amp;L.
            </Text>
          </View>
        ) : (
          positions.map((p) => {
            const unreal = p.unrealizedPnl;
            const basis = p.avgPrice * p.quantity;
            const unrealPct =
              basis !== 0 ? (unreal / basis) * 100 : 0;

            const unrealColor =
              unreal > 0
                ? theme.success ?? theme.accent
                : unreal < 0
                ? theme.danger ?? theme.accent
                : theme.textSoft;

            return (
              <TouchableOpacity
                key={p.symbol}
                style={[
                  styles.positionRow,
                  {
                    borderColor: theme.cardBorder,
                    backgroundColor: theme.surface,
                  },
                ]}
                onPress={() => openTrade(p.symbol)}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.symbol,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {p.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.positionMeta,
                      { color: theme.textSoft },
                    ]}
                  >
                    {p.quantity.toFixed(4)} @{" "}
                    {p.avgPrice.toFixed(2)} {baseCurrency}
                  </Text>
                  {p.currentPrice !== null && (
                    <Text
                      style={[
                        styles.positionMeta,
                        { color: theme.textSoft },
                      ]}
                    >
                      Live: {p.currentPrice.toFixed(2)}{" "}
                      {baseCurrency}
                    </Text>
                  )}
                </View>
                <View style={styles.positionRight}>
                  <Text
                    style={[
                      styles.positionValue,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {p.marketValue.toFixed(2)} {baseCurrency}
                  </Text>
                  <Text
                    style={[
                      styles.positionPnl,
                      { color: unrealColor },
                    ]}
                  >
                    {unreal >= 0 ? "+" : ""}
                    {unreal.toFixed(2)}{" "}
                    {unrealPct !== 0
                      ? `(${unrealPct >= 0 ? "+" : ""}${unrealPct.toFixed(
                          2
                        )}%)`
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* TRADE MODAL */}
      <TradeModal
        visible={tradeVisible}
        onClose={() => setTradeVisible(false)}
        symbol={selectedSymbol}
      />
    </View>
  );
};

export default PortfolioScreen;

// --------- STYLES ---------

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // HEADER
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  modePill: {
    marginTop: 10,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  modeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // CARD
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  equityValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 12,
  },
  col: {
    flex: 1,
  },
  cardValueSmall: {
    fontSize: 14,
    fontWeight: "500",
  },

  // PNL PILL
  pnlPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pnlPillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // ALLOCATION
  allocWrapper: {
    marginTop: 14,
  },
  allocTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  allocFill: {
    height: 6,
    borderRadius: 999,
  },
  allocLabelsRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  allocLabel: {
    fontSize: 11,
  },

  // SECTION HEADERS
  sectionHeader: {
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionHeaderInner: {
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  sectionTitleSm: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionHint: {
    fontSize: 11,
    marginTop: 2,
  },

  // PERFORMANCE CARDS
  perfRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  perfCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
  },
  perfLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  perfValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  // POSITIONS
  positionRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  symbol: {
    fontSize: 16,
    fontWeight: "600",
  },
  positionMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  positionRight: {
    alignItems: "flex-end",
  },
  positionValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  positionPnl: {
    fontSize: 13,
    marginTop: 2,
  },

  // EMPTY & STATES
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
