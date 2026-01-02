// src/screens/AlertsScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { api } from "../services/apiClient";
import i18n from "../config/i18n";

// ---------- Types matching backend payload ----------

export type HeatmapBias = "bullish" | "bearish" | "neutral";

export interface HeatmapItem {
  symbol: string;
  name: string;
  assetClass: "stock" | "crypto" | "forex" | "metal" | "etf" | "other";
  sector?: string | null;
  changePct: number;
  volatility?: number | null;
  aiBias: HeatmapBias;
  aiConfidence: number; // 0–1
  sentimentScore?: number;
  jumpProbability?: number;
  heat: number; // 0–1
}

export type DashboardSignalDirection = "long" | "short" | "watch";

export interface DashboardSignal {
  symbol: string;
  name: string;
  assetClass: HeatmapItem["assetClass"];
  sector?: string | null;
  direction: DashboardSignalDirection;
  heat: number;
  changePct: number;
  aiBias: HeatmapItem["aiBias"];
  aiConfidence: number;
  jumpProbability?: number;
  timeHorizon: string;
  thesis: any; // can be string or { title, text } – normalized with safeText
  riskNote: any; // same
  suggestedEntry?: number;
  suggestedStop?: number;
  suggestedTarget?: number;
  aiComment?: any; // can also be object
}

// 🧠 News Sentiment coming from backend Super AI
export type SentimentLabel = "bullish" | "bearish" | "neutral";

export interface NewsSentiment {
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
}

export interface AiDashboardPayload {
  generatedAt: string;
  heatmap: HeatmapItem[];
  spotlight: DashboardSignal[];
  summary?: any; // string OR { title, text } – normalize at runtime
  newsSentiment?: NewsSentiment[]; // ⬅️ Super AI news layer
}

// ---------- Tabs ----------

const ALERT_TABS = [
  i18n.t("alerts.tabAll"),
  i18n.t("alerts.tabSignals"),
  i18n.t("alerts.tabNews"),
  i18n.t("alerts.tabPortfolio"),
  i18n.t("alerts.tabRisk")
] as const;
type AlertTab = (typeof ALERT_TABS)[number];

// ---------- Helper: normalize any text (fix {title, text} bug) ----------

function safeText(value: any): string {
  if (value == null) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const title = value.title != null ? String(value.title) : "";
    const text = value.text != null ? String(value.text) : "";
    const combined =
      title && text ? `${title} — ${text}` : title || text || "";
    return combined || JSON.stringify(value);
  }

  return String(value);
}

// ---------- Helper: AI recommendation sentence ----------

function buildTrediaRecommendation(signal: DashboardSignal): string {
  const aiCommentText = safeText(signal.aiComment);
  if (aiCommentText.trim().length > 0) {
    return aiCommentText.trim();
  }

  const confidence = Math.round(signal.aiConfidence * 100);
  const jump = signal.jumpProbability
    ? Math.round(signal.jumpProbability * 100)
    : null;

  let action: string;
  if (signal.direction === "long") {
    action =
      "consider a LONG position or adding to an existing long, with controlled size and a clear stop-loss.";
  } else if (signal.direction === "short") {
    action =
      "consider a SHORT position, taking profit on existing longs or reducing your exposure on this name.";
  } else {
    action =
      "avoid forcing a trade here and keep this asset on your watchlist until the setup becomes clearer.";
  }

  let jumpPart = "";
  if (jump && jump >= 70) {
    jumpPart = ` I detect a ${jump}% chance of a significant move within this horizon.`;
  } else if (jump && jump >= 40) {
    jumpPart = ` There is a moderate (${jump}%) probability of a meaningful move developing.`;
  }

  let levels = "";
  if (
    signal.suggestedEntry !== undefined ||
    signal.suggestedStop !== undefined ||
    signal.suggestedTarget !== undefined
  ) {
    const parts: string[] = [];
    if (signal.suggestedEntry !== undefined) {
      parts.push(`entry zone near ${signal.suggestedEntry}`);
    }
    if (signal.suggestedStop !== undefined) {
      parts.push(`stop-loss around ${signal.suggestedStop}`);
    }
    if (signal.suggestedTarget !== undefined) {
      parts.push(`first target near ${signal.suggestedTarget}`);
    }
    if (parts.length > 0) {
      levels =
        `\n\nIndicative trade plan: ${parts.join(
          ", "
        )}. Adjust size and levels to your own risk tolerance.`;
    }
  }

  return (
    `Based on the current data, my confidence on this setup is around ${confidence}%. ` +
    `My recommendation is to ${action} over the next ${signal.timeHorizon}.` +
    jumpPart +
    ` Always manage position sizing, leverage and stop-loss according to your own profile.` +
    levels
  );
}

// ---------- Screen ----------

type AlertsScreenProps = NativeStackScreenProps<RootStackParamList, "Alerts">;

export default function AlertsScreen(_props: AlertsScreenProps) {
  return <AlertsContent />;
}

// ---------- Content Component ----------

export function AlertsContent() {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<AlertTab>("All");

  const [dashboard, setDashboard] = useState<AiDashboardPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboard(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      let json: AiDashboardPayload | null = null;
      try {
        const res = await api.get<AiDashboardPayload>("/ai/dashboard", {
          params: {
            heatmapLimit: 40,
            spotlightLimit: 5,
            newsLimit: 20,
          },
        });
        json = res.data;
      } catch (err: any) {
        // If 401 or network error, fallback to dev data only in __DEV__
        if (__DEV__) {
          json = {
            generatedAt: new Date().toISOString(),
            heatmap: [],
            spotlight: [],
            summary: "[DEV] No live data. Connect backend.",
            newsSentiment: [],
          };
        } else {
          throw err;
        }
      }
      setDashboard(json || null);
    } catch (err) {
      console.warn("[Alerts] dashboard fetch failed", err);
      setError("Super AI dashboard is temporarily unavailable.");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchDashboard(false);
  }, []);

  const onRefresh = () => void fetchDashboard(true);

  // -------- SAFE NORMALIZATION --------
  const rawHeatmap = (dashboard as any)?.heatmap;
  const rawSpotlight = (dashboard as any)?.spotlight;
  const rawNewsSentiment = (dashboard as any)?.newsSentiment;

  const heatmap: HeatmapItem[] = Array.isArray(rawHeatmap) ? rawHeatmap : [];
  const spotlight: DashboardSignal[] = Array.isArray(rawSpotlight)
    ? rawSpotlight
    : [];
  const newsSentiment: NewsSentiment[] = Array.isArray(rawNewsSentiment)
    ? rawNewsSentiment
    : [];

  const rawSummary = dashboard?.summary;
  const summaryText = safeText(rawSummary);

  const topHot = heatmap.slice(0, 4);
  const topSignals = spotlight.slice(0, 3);
  const topNews = newsSentiment.slice(0, 8);

  const bearishItems = heatmap
    .filter((h) => h.aiBias === "bearish")
    .slice(0, 4);

  const highRiskNews = newsSentiment
    .filter(
      (n) =>
        n.sentimentLabel === "bearish" &&
        typeof n.impactScore === "number" &&
        n.impactScore >= 60
    )
    .slice(0, 5);
  // ----------------------------------------------------------

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          tintColor={theme.accent}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.textPrimary }]}> 
            {i18n.t("alerts.title")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSoft }]}> 
            {i18n.t("alerts.subtitle")}
          </Text>
        </View>
        {loading && <ActivityIndicator size="small" color={theme.accent} />}
      </View>

      {/* Tabs row */}
      <View
        style={[
          styles.tabsRow,
          {
            borderColor: theme.cardBorder,
            backgroundColor: theme.surfaceAlt,
          },
        ]}
      >
        {ALERT_TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                isActive && {
                  backgroundColor: theme.accent,
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? theme.background : theme.textSoft,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: theme.textSoft }]}> 
          {i18n.t("alerts.error", { error })}
        </Text>
      )}

      {/* ---------- ALL TAB ---------- */}
      {activeTab === "All" && (
        <>
          {/* Summary */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[styles.summaryLabel, { color: theme.accent }]}
              numberOfLines={1}
            >
              {i18n.t("alerts.summaryLabel")}
            </Text>

            <Text
              style={[styles.summaryText, { color: theme.textPrimary }]}
            >
              {summaryText
                ? summaryText
                : i18n.t("alerts.summaryFallback")}
            </Text>

            {dashboard?.generatedAt && (
              <Text
                style={[styles.summaryMeta, { color: theme.textSoft }]}
              >
                {i18n.t("alerts.updated", { time: new Date(dashboard.generatedAt).toLocaleTimeString() })}
              </Text>
            )}
          </View>

          {/* Spotlight Section */}
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.textPrimary }]}
            >
              {i18n.t("alerts.spotlightTitle")}
            </Text>
            {spotlight.length > 0 && (
              <Text
                style={[
                  styles.sectionCaption,
                  { color: theme.textSoft },
                ]}
              >
                {i18n.t("alerts.spotlightCaption", { count: spotlight.length })}
              </Text>
            )}
          </View>

          {spotlight.length === 0 && !loading && !error && (
            <Text style={[styles.emptyText, { color: theme.textSoft }]}> 
              {i18n.t("alerts.spotlightEmpty")}
            </Text>
          )}

          {topSignals.map((s) => {
            const heatPct = Math.round(s.heat * 100);
            const dirLabel =
              s.direction === "long"
                ? "LONG bias"
                : s.direction === "short"
                ? "SHORT bias"
                : "On watch";

            const dirColor =
              s.direction === "long"
                ? theme.success
                : s.direction === "short"
                ? theme.danger
                : theme.accent;

            const moveText =
              (s.changePct >= 0 ? "+" : "") + s.changePct.toFixed(2) + "%";

            const aiRecommendation = buildTrediaRecommendation(s);
            const thesisText = safeText(s.thesis);
            const riskText = safeText(s.riskNote);

            return (
              <TouchableOpacity
                key={s.symbol + s.timeHorizon}
                style={[
                  styles.spotlightCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("AssetDetail", { symbol: s.symbol })
                }
              >
                <View style={styles.spotlightHeaderRow}>
                  <View>
                    <Text
                      style={[
                        styles.spotlightSymbol,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {s.symbol}
                    </Text>
                    <Text
                      style={[
                        styles.spotlightName,
                        { color: theme.textSoft },
                      ]}
                    >
                      {s.name}
                    </Text>
                  </View>

                  <View
                    style={[styles.dirPill, { borderColor: dirColor }]}
                  >
                    <Text
                      style={[
                        styles.dirPillText,
                        { color: dirColor },
                      ]}
                    >
                      {dirLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.spotlightMetaRow}>
                  <Text
                    style={[
                      styles.spotlightMove,
                      {
                        color:
                          s.changePct >= 0
                            ? theme.success
                            : theme.danger,
                      },
                    ]}
                  >
                    {moveText}
                  </Text>
                  <Text
                    style={[
                      styles.spotlightHorizon,
                      { color: theme.textSoft },
                    ]}
                  >
                    {s.timeHorizon}
                  </Text>
                  <Text
                    style={[
                      styles.spotlightConfidence,
                      { color: theme.textSoft },
                    ]}
                  >
                    AI {Math.round(s.aiConfidence * 100)}% · Heat{" "}
                    {heatPct}
                    /100
                  </Text>
                </View>

                <Text
                  style={[
                    styles.spotlightThesis,
                    { color: theme.textPrimary },
                  ]}
                >
                  {thesisText}
                </Text>
                <Text
                  style={[styles.spotlightRisk, { color: theme.textSoft }]}
                >
                  {riskText}
                </Text>

                <Text
                  style={[
                    styles.aiRecommendationText,
                    { color: theme.textPrimary },
                  ]}
                >
                  {aiRecommendation}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Heatmap Section */}
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.textPrimary }]}
            >
              Super AI Heatmap
            </Text>
            {heatmap.length > 0 && (
              <Text
                style={[
                  styles.sectionCaption,
                  { color: theme.textSoft },
                ]}
              >
                Ranked by AI heat (top {Math.min(heatmap.length, 12)})
              </Text>
            )}
          </View>

          {heatmap.length === 0 && !loading && !error && (
            <Text style={[styles.emptyText, { color: theme.textSoft }]}>
              Heatmap loading... As soon as your market data provider connects,
              assets will appear here with live updates.
            </Text>
          )}

          {topHot.map((item) => {
            const heatPct = Math.round(item.heat * 100);
            const changeText =
              (item.changePct >= 0 ? "+" : "") +
              item.changePct.toFixed(2) +
              "%";

            const biasLabel =
              item.aiBias === "bullish"
                ? "Bullish bias"
                : item.aiBias === "bearish"
                ? "Bearish bias"
                : "Neutral bias";

            const biasColor =
              item.aiBias === "bullish"
                ? theme.success
                : item.aiBias === "bearish"
                ? theme.danger
                : theme.accent;

            return (
              <TouchableOpacity
                key={item.symbol}
                style={[
                  styles.heatRow,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("AssetDetail", {
                    symbol: item.symbol,
                  })
                }
              >
                <View style={styles.heatRowLeft}>
                  <Text
                    style={[
                      styles.heatSymbol,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {item.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.heatName,
                      { color: theme.textSoft },
                    ]}
                  >
                    {item.name}
                  </Text>

                  <View style={styles.heatMetaRow}>
                    {item.sector && (
                      <View
                        style={[
                          styles.heatBadge,
                          { borderColor: theme.cardBorder },
                        ]}
                      >
                        <Text
                          style={[
                            styles.heatBadgeText,
                            { color: theme.textSoft },
                          ]}
                        >
                          {item.sector}
                        </Text>
                      </View>
                    )}

                    <View
                      style={[
                        styles.heatBadge,
                        { borderColor: biasColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.heatBadgeText,
                          { color: biasColor },
                        ]}
                      >
                        {biasLabel}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.heatBadge,
                        { borderColor: theme.cardBorder },
                      ]}
                    >
                      <Text
                        style={[
                          styles.heatBadgeText,
                          { color: theme.textSoft },
                        ]}
                      >
                        AI {Math.round(item.aiConfidence * 100)}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.heatRowRight}>
                  <Text
                    style={[
                      styles.heatChangeText,
                      {
                        color:
                          item.changePct >= 0
                            ? theme.success
                            : theme.danger,
                      },
                    ]}
                  >
                    {changeText}
                  </Text>

                  <View
                    style={[
                      styles.heatBarTrack,
                      { backgroundColor: theme.surfaceAlt },
                    ]}
                  >
                    <View
                      style={[
                        styles.heatBarFill,
                        {
                          backgroundColor: biasColor,
                          width: `${Math.max(5, heatPct)}%` as any,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.heatScoreText,
                      { color: theme.textSoft },
                    ]}
                  >
                    Heat score: {heatPct} / 100
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 32 }} />
        </>
      )}

      {/* ---------- SIGNALS TAB ---------- */}
      {activeTab === "Signals" && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.textPrimary }]}
            >
              AI Trading Signals
            </Text>
            <Text
              style={[styles.sectionCaption, { color: theme.textSoft }]}
            >
              Ranked by confidence & heat
            </Text>
          </View>

          {spotlight.length === 0 && !loading && !error && (
            <Text style={[styles.emptyText, { color: theme.textSoft }]}>
              No live signals yet. Once Super AI is connected to your data
              provider, this tab will show real trade ideas with timing & risk.
            </Text>
          )}

          {spotlight.map((s) => {
            const dirColor =
              s.direction === "long"
                ? theme.success
                : s.direction === "short"
                ? theme.danger
                : theme.accent;

            const moveText =
              (s.changePct >= 0 ? "+" : "") +
              s.changePct.toFixed(2) +
              "%";

            const aiRecommendation = buildTrediaRecommendation(s);
            const thesisText = safeText(s.thesis);
            const riskText = safeText(s.riskNote);

            return (
              <TouchableOpacity
                key={s.symbol + s.timeHorizon + "signals"}
                style={[
                  styles.signalCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("AssetDetail", {
                    symbol: s.symbol,
                  })
                }
              >
                <View style={styles.signalHeaderRow}>
                  <View>
                    <Text
                      style={[
                        styles.signalSymbol,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {s.symbol} · {s.assetClass.toUpperCase()}
                    </Text>
                    <Text
                      style={[
                        styles.signalName,
                        { color: theme.textSoft },
                      ]}
                    >
                      {s.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.signalPill,
                      { borderColor: dirColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.signalPillText,
                        { color: dirColor },
                      ]}
                    >
                      {s.direction.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.signalMetaRow}>
                  <Text
                    style={[
                      styles.signalMove,
                      {
                        color:
                          s.changePct >= 0
                            ? theme.success
                            : theme.danger,
                      },
                    ]}
                  >
                    {moveText}
                  </Text>
                  <Text
                    style={[
                      styles.signalMetaText,
                      { color: theme.textSoft },
                    ]}
                  >
                    {s.timeHorizon}
                  </Text>
                  <Text
                    style={[
                      styles.signalMetaText,
                      { color: theme.textSoft },
                    ]}
                  >
                    AI conf. {Math.round(s.aiConfidence * 100)}%
                  </Text>
                  {typeof s.jumpProbability === "number" && (
                    <Text
                      style={[
                        styles.signalMetaText,
                        { color: theme.textSoft },
                      ]}
                    >
                      Jump prob. {Math.round(s.jumpProbability * 100)}%
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.signalThesis,
                    { color: theme.textPrimary },
                  ]}
                >
                  {thesisText}
                </Text>
                <Text
                  style={[styles.signalRisk, { color: theme.textSoft }]}
                >
                  Risk: {riskText}
                </Text>

                <Text
                  style={[
                    styles.aiRecommendationText,
                    { color: theme.textPrimary },
                  ]}
                >
                  {aiRecommendation}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 32 }} />
        </>
      )}

      {/* ---------- NEWS TAB ---------- */}
      {activeTab === "News" && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.textPrimary }]}
            >
              News & Market Moves
            </Text>
            <Text
              style={[styles.sectionCaption, { color: theme.textSoft }]}
            >
              Super AI sentiment · impacted assets · timing
            </Text>
          </View>

          {topNews.length === 0 && !loading && !error && (
            <Text style={[styles.emptyText, { color: theme.textSoft }]}>
              Once your News AI is live, this tab will show live headlines,
              sentiment and linked assets. For now it falls back to whatever
              your backend provides.
            </Text>
          )}

          {topNews.map((n) => {
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

            const impacted = Array.isArray(n.impactedSymbols)
              ? n.impactedSymbols
              : [];

            const horizonLabel =
              n.horizon === "intraday"
                ? "0–24h"
                : n.horizon === "position"
                ? "weeks+"
                : "1–7 days";

            return (
              <View
                key={n.id}
                style={[
                  styles.newsCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.newsTag,
                    { color: badgeColor, borderColor: badgeColor },
                  ]}
                >
                  {badgeText.toUpperCase()} • Impact {n.impactScore}/100
                </Text>

                <Text
                  style={[
                    styles.newsTitle,
                    { color: theme.textPrimary },
                  ]}
                  numberOfLines={2}
                >
                  {n.title}
                </Text>

                <Text
                  style={[
                    styles.newsBody,
                    { color: theme.textSoft },
                  ]}
                  numberOfLines={3}
                >
                  {n.aiComment && n.aiComment.trim().length > 0
                    ? n.aiComment
                    : n.summary || "AI is still parsing this story."}
                </Text>

                <View style={styles.newsFooterRow}>
                  <Text
                    style={[
                      styles.newsFooterText,
                      { color: theme.textSoft },
                    ]}
                  >
                    Horizon: {horizonLabel}
                  </Text>
                  <Text
                    style={[
                      styles.newsFooterText,
                      { color: theme.textSoft },
                    ]}
                  >
                    AI conf. {Math.round(n.confidence * 100)}%
                  </Text>
                </View>

                {impacted.length > 0 && (
                  <View style={styles.newsAssetsBlock}>
                    <Text
                      style={[
                        styles.newsFooterText,
                        { color: theme.textSoft },
                      ]}
                    >
                      Assets impacted:
                    </Text>
                    <View style={styles.newsAssetsPillsRow}>
                      {impacted.slice(0, 6).map((sym) => (
                        <TouchableOpacity
                          key={sym}
                          style={[
                            styles.assetPill,
                            { borderColor: theme.cardBorder },
                          ]}
                          onPress={() =>
                            navigation.navigate("AssetDetail", {
                              symbol: sym,
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.assetPillText,
                              { color: theme.textPrimary },
                            ]}
                          >
                            {sym}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <Text
                      style={[
                        styles.newsCtaText,
                        { color: theme.accent },
                      ]}
                    >
                      Tap an asset to view its live chart & signals.
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

          <View style={{ height: 32 }} />
        </>
      )}

      {/* ---------- PORTFOLIO TAB ---------- */}
      {activeTab === "Portfolio" && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.textPrimary }]}
            >
              Portfolio Alerts
            </Text>
            <Text
              style={[styles.sectionCaption, { color: theme.textSoft }]}
            >
              Per-asset risk & opportunity (coming soon)
            </Text>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <Text
              style={[styles.summaryLabel, { color: theme.accent }]}
            >
              CONNECT YOUR BROKER
            </Text>
            <Text
              style={[
                styles.summaryText,
                { color: theme.textPrimary },
              ]}
            >
              Once your real or paper portfolio is connected, Tredia will
              monitor each position and send alerts when risk, news or AI heat
              crosses your thresholds.
            </Text>
            <Text
              style={[styles.summaryMeta, { color: theme.textSoft }]}
            >
              Example: “Your TSLA position is now high-risk for the next 48h
              (earnings + volatility spike).”
            </Text>
          </View>

          {topHot.map((item) => {
            const biasColor =
              item.aiBias === "bullish"
                ? theme.success
                : item.aiBias === "bearish"
                ? theme.danger
                : theme.accent;

            return (
              <TouchableOpacity
                key={item.symbol + "portfolio"}
                style={[
                  styles.portfolioCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("AssetDetail", {
                    symbol: item.symbol,
                  })
                }
              >
                <View style={styles.portfolioRow}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.portfolioSymbol,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {item.symbol}
                    </Text>
                    <Text
                      style={[
                        styles.portfolioName,
                        { color: theme.textSoft },
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                  </View>

                  <View style={{ alignItems: "flex-end" }}>
                    <Text
                      style={[
                        styles.portfolioHeat,
                        { color: biasColor },
                      ]}
                    >
                      Heat {Math.round(item.heat * 100)} / 100
                    </Text>
                    <Text
                      style={[
                        styles.portfolioAi,
                        { color: theme.textSoft },
                      ]}
                    >
                      AI conf. {Math.round(item.aiConfidence * 100)}%
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.portfolioHint,
                    { color: theme.textSoft },
                  ]}
                  numberOfLines={2}
                >
                  This card will later combine your position size, entry price
                  and AI view to show “hold / trim / add / exit” style
                  guidance.
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 32 }} />
        </>
      )}

      {/* ---------- RISK TAB ---------- */}
      {activeTab === "Risk" && (
        <>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, { color: theme.textPrimary }]}
            >
              High-Risk Zones
            </Text>
            <Text
              style={[styles.sectionCaption, { color: theme.textSoft }]}
            >
              Bearish bias · elevated volatility · news-driven shocks
            </Text>
          </View>

          {/* News-driven risk clusters */}
          {highRiskNews.length > 0 && (
            <>
              <Text
                style={[
                  styles.sectionCaption,
                  { color: theme.textSoft, marginBottom: 8 },
                ]}
              >
                News clusters where Super AI sees concentrated downside risk:
              </Text>

              {highRiskNews.map((n) => {
                const impacted = Array.isArray(n.impactedSymbols)
                  ? n.impactedSymbols
                  : [];

                return (
                  <View
                    key={n.id + "risknews"}
                    style={[
                      styles.riskNewsCard,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.riskNewsTitle,
                        { color: theme.textPrimary },
                      ]}
                      numberOfLines={2}
                    >
                      {n.title}
                    </Text>
                    <Text
                      style={[
                        styles.riskBody,
                        { color: theme.textSoft },
                      ]}
                      numberOfLines={3}
                    >
                      {n.aiComment ||
                        "AI detects bearish pressure around this story. Consider tightening risk if you are exposed."}
                    </Text>

                    <View style={styles.riskMetaRow}>
                      <Text
                        style={[
                          styles.riskMeta,
                          { color: theme.textSoft },
                        ]}
                      >
                        Impact {n.impactScore}/100
                      </Text>
                      <Text
                        style={[
                          styles.riskMeta,
                          { color: theme.textSoft },
                        ]}
                      >
                        AI conf. {Math.round(n.confidence * 100)}%
                      </Text>
                    </View>

                    {impacted.length > 0 && (
                      <View style={styles.newsAssetsBlock}>
                        <Text
                          style={[
                            styles.riskMeta,
                            { color: theme.textSoft },
                          ]}
                        >
                          Most exposed assets:
                        </Text>
                        <View style={styles.newsAssetsPillsRow}>
                          {impacted.slice(0, 6).map((sym) => (
                            <TouchableOpacity
                              key={sym + "riskpill"}
                              style={[
                                styles.assetPill,
                                { borderColor: theme.cardBorder },
                              ]}
                              onPress={() =>
                                navigation.navigate("AssetDetail", {
                                  symbol: sym,
                                })
                              }
                            >
                              <Text
                                style={[
                                  styles.assetPillText,
                                  { color: theme.textPrimary },
                                ]}
                              >
                                {sym}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}

          {/* Asset-level bearish heatmap */}
          {bearishItems.length === 0 &&
            highRiskNews.length === 0 &&
            !loading &&
            !error && (
              <Text
                style={[styles.emptyText, { color: theme.textSoft }]}
              >
                No strong bearish clusters yet. When Super AI detects
                concentrated downside risk, this tab will list the most exposed
                assets and news stories.
              </Text>
            )}

          {bearishItems.map((item) => {
            const changeText =
              (item.changePct >= 0 ? "+" : "") +
              item.changePct.toFixed(2) +
              "%";

            return (
              <TouchableOpacity
                key={item.symbol + "risk"}
                style={[
                  styles.riskCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() =>
                  navigation.navigate("AssetDetail", {
                    symbol: item.symbol,
                  })
                }
              >
                <View style={styles.riskHeaderRow}>
                  <Text
                    style={[
                      styles.riskSymbol,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {item.symbol}
                  </Text>
                  <Text
                    style={[
                      styles.riskChange,
                      { color: theme.danger },
                    ]}
                  >
                    {changeText}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.riskName,
                    { color: theme.textSoft },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.riskBody,
                    { color: theme.textSoft },
                  ]}
                  numberOfLines={3}
                >
                  Super AI flags this asset as high-risk with bearish bias and
                  elevated heat. Confidence{" "}
                  {Math.round(item.aiConfidence * 100)}%. Use smaller size,
                  tighter stops or wait for volatility to cool down.
                </Text>

                <View style={styles.riskMetaRow}>
                  {item.sector && (
                    <Text
                      style={[
                        styles.riskMeta,
                        { color: theme.textSoft },
                      ]}
                    >
                      Sector: {item.sector}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.riskMeta,
                      { color: theme.textSoft },
                    ]}
                  >
                    Heat {Math.round(item.heat * 100)} / 100
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 32 }} />
        </>
      )}
    </ScrollView>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },

  // Tabs
  tabsRow: {
    flexDirection: "row",
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    marginBottom: 18,
  },
  tabItem: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  summaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 18,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  summaryMeta: {
    fontSize: 11,
  },

  errorText: {
    fontSize: 12,
    marginBottom: 12,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
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
    marginBottom: 12,
  },

  // Spotlight
  spotlightCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  spotlightHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  spotlightSymbol: {
    fontSize: 16,
    fontWeight: "800",
  },
  spotlightName: {
    fontSize: 13,
  },
  dirPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  dirPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  spotlightMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  spotlightMove: {
    fontSize: 15,
    fontWeight: "700",
  },
  spotlightHorizon: {
    fontSize: 12,
  },
  spotlightConfidence: {
    fontSize: 11,
  },
  spotlightThesis: {
    fontSize: 13,
    marginBottom: 4,
  },
  spotlightRisk: {
    fontSize: 12,
  },
  aiRecommendationText: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },

  // Heatmap styles
  heatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  heatRowLeft: {
    flex: 2,
  },
  heatRowRight: {
    flex: 1.2,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  heatSymbol: {
    fontSize: 16,
    fontWeight: "800",
  },
  heatName: {
    fontSize: 12,
    marginTop: 2,
  },
  heatMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  heatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  heatBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  heatChangeText: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  heatBarTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
    width: 90,
    marginBottom: 4,
  },
  heatBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  heatScoreText: {
    fontSize: 11,
  },

  // Signals tab
  signalCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  signalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  signalSymbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  signalName: {
    fontSize: 12,
  },
  signalPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  signalPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  signalMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
    marginTop: 2,
  },
  signalMove: {
    fontSize: 14,
    fontWeight: "700",
  },
  signalMetaText: {
    fontSize: 11,
  },
  signalThesis: {
    fontSize: 13,
    marginBottom: 2,
  },
  signalRisk: {
    fontSize: 12,
  },

  // News tab
  newsCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  newsTag: {
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
  newsTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  newsBody: {
    fontSize: 13,
    marginBottom: 6,
  },
  newsFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  newsFooterText: {
    fontSize: 11,
  },
  newsAssetsBlock: {
    marginTop: 8,
  },
  newsAssetsPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    rowGap: 6,
    columnGap: 6,
  },
  assetPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  assetPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  newsCtaText: {
    fontSize: 11,
    marginTop: 4,
  },

  // Portfolio tab
  portfolioCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  portfolioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  portfolioSymbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  portfolioName: {
    fontSize: 12,
    marginTop: 2,
  },
  portfolioHeat: {
    fontSize: 12,
    fontWeight: "700",
  },
  portfolioAi: {
    fontSize: 11,
  },
  portfolioHint: {
    fontSize: 12,
    marginTop: 4,
  },

  // Risk tab
  riskNewsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  riskNewsTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  riskCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  riskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  riskSymbol: {
    fontSize: 16,
    fontWeight: "800",
  },
  riskChange: {
    fontSize: 14,
    fontWeight: "700",
  },
  riskName: {
    fontSize: 12,
    marginTop: 2,
  },
  riskBody: {
    fontSize: 12,
    marginTop: 6,
  },
  riskMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  riskMeta: {
    fontSize: 11,
  },
});
