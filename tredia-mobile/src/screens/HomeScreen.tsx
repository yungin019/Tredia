// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../context/ThemeContext";
import {
  fetchMarketMovers,
  fetchTrending,
  fetchDailyBrief,
} from "../services/marketService";
import { fetchAiDashboard } from "../services/aiDashboardService";

import MiniSparkline from "../components/charts/MiniSparkline";
import ScreenWrapper from "../components/ScreenWrapper";
import GradientBackground from "../components/GradientBackground";
import GlowView from "../components/GlowView";

type NewsItem = {
  id: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  source?: string | null;
  publishedAt?: string | null;
  imageUrl?: string | null;
  url?: string | null;
};

type BriefObject = {
  title?: string;
  text?: string;
};

type BriefState = string | BriefObject | null;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const NEWS_PAGE_WIDTH = SCREEN_WIDTH - 40; // match card width

export default function HomeScreen() {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState<BriefState>(null);
  const [movers, setMovers] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const newsScrollRef = useRef<ScrollView | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  async function load() {
    try {
      setLoading(true);

      const [b, m, t, dash] = await Promise.all([
        fetchDailyBrief(),
        fetchMarketMovers(), // now backed by live Polygon data
        fetchTrending(), // live as well
        fetchAiDashboard().catch(() => null),
      ]);

      // 1) Base data from /markets/trends (always used)
      const baseMovers = Array.isArray(m) ? m : [];
      const baseTrending = Array.isArray(t) ? t : [];

      let finalMovers: any[] = baseMovers;
      let finalTrending: any[] = baseTrending;

      // 2) Normalize brief
      const rawBrief: any = b?.summary ?? null;

      if (!rawBrief) {
        setBrief(null);
      } else if (typeof rawBrief === "string") {
        setBrief(rawBrief);
      } else if (typeof rawBrief === "object") {
        const safeObj: BriefObject = {
          title:
            typeof (rawBrief as any).title === "string"
              ? (rawBrief as any).title
              : undefined,
          text:
            typeof (rawBrief as any).text === "string"
              ? (rawBrief as any).text
              : undefined,
        };
        setBrief(safeObj);
      } else {
        setBrief(null);
      }

      setLastUpdated(new Date());

      // 3) Optional AI dashboard overlay (only if it brings something better)
      const d: any = dash || {};

      // AI signals → override movers if present
      if (Array.isArray(d.signals) && d.signals.length > 0) {
        finalMovers = d.signals.map((s: any) => ({
          symbol: s.symbol,
          name: s.name ?? s.symbol,
          changePct: typeof s.changePct === "number" ? s.changePct : 0,
          sparkline: s.sparkline ?? [],
        }));
      }

      // AI-based trending → override trending if present
      const trendingAI =
        d.newsSentiment ??
        d.topNews ??
        d.news ??
        [];

      if (Array.isArray(trendingAI) && trendingAI.length > 0) {
        finalTrending = trendingAI.map((n: any) => ({
          symbol: n.symbol ?? n.ticker ?? "",
          name: n.name ?? n.company ?? "",
          changePct: typeof n.changePct === "number" ? n.changePct : 0,
          sparkline: n.sparkline ?? [],
        }));
      }

      // Apply final lists (live markets + AI overlay if available)
      setMovers(finalMovers);
      setTrending(finalTrending);

      // 4) Normalize news from AI dashboard
      const newsRaw =
        d.newsRadar ?? d.news ?? d.headlines ?? d.topNews ?? [];

      const normalizedNews: NewsItem[] = Array.isArray(newsRaw)
        ? newsRaw.map((n: any, idx: number): NewsItem => {
            let rawTitle: any =
              n.title ?? n.headline ?? "Untitled headline";
            let rawSummary: any = n.summary ?? n.description ?? null;

            if (rawTitle && typeof rawTitle === "object") {
              const obj = rawTitle as any;
              const t = String(obj.title ?? "");
              const x = String(obj.text ?? "");
              rawTitle = `${t}${t && x ? " — " : ""}${x}`;
            }

            if (rawSummary && typeof rawSummary === "object") {
              const obj = rawSummary as any;
              const t = String(obj.title ?? "");
              const x = String(obj.text ?? "");
              rawSummary = `${t}${t && x ? " " : ""}${x}` || null;
            }

            const img =
              n.imageUrl ?? n.image ?? n.thumbnail ?? n.thumb ?? null;

            return {
              id: String(n.id ?? idx),
              title:
                typeof rawTitle === "string" && rawTitle.length > 0
                  ? rawTitle
                  : "Untitled headline",
              summary:
                typeof rawSummary === "string" && rawSummary.length > 0
                  ? rawSummary
                  : null,
              category:
                n.category ??
                (n.assetClass ? String(n.assetClass).toLowerCase() : null),
              source: n.source ?? n.provider ?? null,
              publishedAt: n.publishedAt ?? n.time ?? n.date ?? null,
              imageUrl: img,
              url: n.url ?? n.link ?? null,
            };
          })
        : [];

      setNews(normalizedNews);
    } catch (e) {
      console.warn("Home load error", e);
      setMovers([]);
      setTrending([]);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // Auto-rotate news carousel
  useEffect(() => {
    if (news.length <= 1) return;

    const interval = setInterval(() => {
      setNewsIndex((prev) => {
        const next = (prev + 1) % news.length;
        if (newsScrollRef.current) {
          newsScrollRef.current.scrollTo({
            x: next * NEWS_PAGE_WIDTH,
            animated: true,
          });
        }
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [news.length]);

  // ---------- Derived lists ----------

  const spotlight = movers.slice(0, 2);

  const moverSymbols = new Set(movers.map((m) => m.symbol));
  const trendingFilteredRaw = trending.filter(
    (asset) => asset && !moverSymbols.has(asset.symbol)
  );
  const trendingList = trendingFilteredRaw;

  const miniWatchlist = trendingList.slice(0, 4);

  const formatTime = (d: Date | null) => {
    if (!d) return "—";
    try {
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  const openAlerts = () => {
    const rootNav = navigation.getParent?.() ?? navigation;
    rootNav.navigate("Alerts");
  };

  const openAssetDetail = (symbol?: string) => {
    if (
      !symbol ||
      typeof symbol !== "string" ||
      symbol.trim().length === 0
    ) {
      console.log(
        "[Home] openAssetDetail called without valid symbol:",
        symbol
      );
      return;
    }

    const rootNav = navigation.getParent?.() ?? navigation;
    rootNav.navigate("AssetDetail", { symbol: symbol.trim() });
  };

  const openAIChat = (presetPrompt?: string) => {
    const rootNav = navigation.getParent?.() ?? navigation;
    rootNav.navigate("AI", {
      presetPrompt: presetPrompt ?? "Give me today’s market brief.",
    });
  };

  // ---------- Sentiment from movers ----------
  let sentimentLabel = "Mixed market";
  let sentimentColor = theme.accent;

  if (movers.length > 0) {
    const avgChange =
      movers.reduce(
        (sum, m) => sum + (typeof m.changePct === "number" ? m.changePct : 0),
        0
      ) / movers.length;

    if (avgChange > 0.4) {
      sentimentLabel = "Bullish momentum";
      sentimentColor = theme.success;
    } else if (avgChange < -0.4) {
      sentimentLabel = "Bearish pressure";
      sentimentColor = theme.danger;
    } else {
      sentimentLabel = "Sideways / mixed";
      sentimentColor = theme.accent;
    }
  }

  // ---------- Brief title/text for rendering ----------
  let briefTitle: string | undefined;
  let briefText: string | undefined;

  if (typeof brief === "string") {
    briefText = brief;
  } else if (brief && typeof brief === "object") {
    briefTitle =
      typeof brief.title === "string" && brief.title.length > 0
        ? brief.title
        : undefined;
    briefText =
      typeof brief.text === "string" && brief.text.length > 0
        ? brief.text
        : undefined;
  }

  const fallbackBrief = "No AI market brief is available right now.";

  // ---------- AI Signals Today ----------
  const bullishCount = movers.filter(
    (m) => typeof m.changePct === "number" && m.changePct > 0.4
  ).length;
  const bearishCount = movers.filter(
    (m) => typeof m.changePct === "number" && m.changePct < -0.4
  ).length;
  const watchlistCount = miniWatchlist.length;

  const headerStats = [
    `${movers.length} movers`,
    `${news.length} headlines`,
    `${watchlistCount} watchlist items`,
  ];

  return (
    <ScreenWrapper>
      <GradientBackground>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 8, // 👈 safe-area so header never hides
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Image
                  source={require("../assets/tredia-icon.png")}
                  style={styles.logo}
                />
                <View>
                  <Text
                    style={[styles.appTitle, { color: theme.textPrimary }]}
                  >
                    Tredia
                  </Text>
                  <Text
                    style={[styles.appSubtitle, { color: theme.textSoft }]}
                    numberOfLines={1}
                  >
                    Your AI trading mentor
                  </Text>
                </View>
              </View>

              <View style={styles.headerRight}>
                <View
                  style={[
                    styles.aiStatusPill,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="sparkles-outline"
                    size={14}
                    color={theme.accent}
                  />
                  <Text
                    style={[
                      styles.aiStatusText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    AI Ready
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.chatCircle,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.cardBorder,
                    },
                  ]}
                  onPress={() => openAIChat()}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={18}
                    color={theme.accent}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* HEADER STATS */}
            <View
              style={[
                styles.headerStatsPill,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.headerStatsDot} />
              <Text
                style={[
                  styles.headerStatsText,
                  { color: theme.textPrimary },
                ]}
                numberOfLines={1}
              >
                Today with Tredia · {headerStats.join(" · ")}
              </Text>
            </View>

            {/* AI MARKET PULSE */}
            <GlowView intensity="medium" radius={24} style={styles.briefGlow}>
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
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text
                      style={[styles.briefLabel, { color: theme.accent }]}
                    >
                      AI Market Pulse
                    </Text>
                    <Text
                      style={[
                        styles.briefSubtitle,
                        { color: theme.textSoft },
                      ]}
                    >
                      Overview of what matters in today’s session
                    </Text>

                    <View style={styles.briefBadgesRow}>
                      <View
                        style={[
                          styles.livePill,
                          {
                            borderColor: theme.accent,
                            backgroundColor: theme.accentSoft,
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
                          style={[
                            styles.livePillText,
                            { color: theme.accent },
                          ]}
                        >
                          LIVE
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.sentimentPill,
                          {
                            borderColor: sentimentColor,
                            backgroundColor: sentimentColor + "20",
                          },
                        ]}
                      >
                        <Ionicons
                          name="trending-up-outline"
                          size={12}
                          color={sentimentColor}
                        />
                        <Text
                          style={[
                            styles.sentimentText,
                            { color: sentimentColor },
                          ]}
                          numberOfLines={1}
                        >
                          {sentimentLabel}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.briefMetaColumn}>
                    <TouchableOpacity onPress={openAlerts}>
                      <Text
                        style={[
                          styles.viewAlertsLink,
                          { color: theme.accent },
                        ]}
                      >
                        View alerts →
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.briefMetaRow}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={theme.textSoft}
                      />
                      <Text
                        style={[
                          styles.briefMetaText,
                          { color: theme.textSoft },
                        ]}
                      >
                        Updated {formatTime(lastUpdated)}
                      </Text>
                    </View>
                  </View>
                </View>

                {loading ? (
                  <View style={styles.briefLoadingRow}>
                    <ActivityIndicator size="small" color={theme.accent} />
                    <Text
                      style={[
                        styles.briefLoadingText,
                        { color: theme.textSoft },
                      ]}
                    >
                      Loading AI brief…
                    </Text>
                  </View>
                ) : (
                  <>
                    {briefTitle && (
                      <Text
                        style={[
                          styles.briefTitle,
                          { color: theme.textPrimary },
                        ]}
                        numberOfLines={2}
                      >
                        {briefTitle}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.briefText,
                        { color: theme.textPrimary },
                      ]}
                      numberOfLines={4}
                    >
                      {briefText || fallbackBrief}
                    </Text>
                  </>
                )}

                <View style={styles.briefCTARow}>
                  <TouchableOpacity
                    style={[
                      styles.primaryCTA,
                      { backgroundColor: theme.accent },
                    ]}
                    onPress={() =>
                      openAIChat(
                        "Give me today’s market brief and key risks."
                      )
                    }
                  >
                    <Ionicons
                      name="flash-outline"
                      size={16}
                      color={theme.onAccent ?? "#000"}
                    />
                    <Text
                      style={[
                        styles.primaryCTAText,
                        { color: theme.onAccent ?? "#000" },
                      ]}
                      numberOfLines={2}
                    >
                      Ask AI about today
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.secondaryCTA,
                      { borderColor: theme.cardBorder },
                    ]}
                    onPress={() =>
                      openAIChat("Expand today’s market brief.")
                    }
                  >
                    <Text
                      style={[
                        styles.secondaryCTAText,
                        { color: theme.textPrimary },
                      ]}
                      numberOfLines={2}
                    >
                      View full brief
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlowView>

            {/* AI SIGNALS TODAY */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                AI Signals Today
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textSoft },
                ]}
                numberOfLines={1}
              >
                Counts based on today’s strongest moves
              </Text>
            </View>

            <View style={styles.signalsRow}>
              <View
                style={[
                  styles.signalCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <Text
                  style={[styles.signalLabel, { color: theme.textSoft }]}
                >
                  Bullish cluster
                </Text>
                <Text
                  style={[
                    styles.signalValueGreen,
                    { color: theme.success },
                  ]}
                >
                  {bullishCount} assets
                </Text>
              </View>

              <View
                style={[
                  styles.signalCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <Text
                  style={[styles.signalLabel, { color: theme.textSoft }]}
                >
                  Bearish pressure
                </Text>
                <Text
                  style={[
                    styles.signalValueRed,
                    { color: theme.danger },
                  ]}
                >
                  {bearishCount} assets
                </Text>
              </View>

              <View
                style={[
                  styles.signalCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <Text
                  style={[styles.signalLabel, { color: theme.textSoft }]}
                >
                  Watchlist
                </Text>
                <Text
                  style={[
                    styles.signalValueBlue,
                    { color: theme.accent },
                  ]}
                >
                  {watchlistCount} items
                </Text>
              </View>
            </View>

            {/* AI NEWS RADAR */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                AI News Radar
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textSoft },
                ]}
              >
                Headlines your mentor is tracking
              </Text>
            </View>

            <View style={styles.newsCarouselWrapper}>
              {news.length === 0 ? (
                <View
                  style={[
                    styles.newsCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: theme.cardBorder,
                      width: SCREEN_WIDTH - 40,
                    },
                  ]}
                >
                  <View style={styles.newsTextBlock}>
                    <Text
                      style={[
                        styles.newsTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      No headlines available
                    </Text>
                    <Text
                      style={[
                        styles.newsSummary,
                        { color: theme.textSoft },
                      ]}
                    >
                      We couldn’t load news right now. Refresh the page or
                      try again in a few minutes.
                    </Text>
                  </View>
                </View>
              ) : (
                <>
                  <ScrollView
                    ref={newsScrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.newsScrollContent}
                    scrollEventThrottle={16}
                    decelerationRate="fast"
                    onScroll={(e) => {
                      const x = e.nativeEvent.contentOffset.x;
                      const idx = Math.round(x / NEWS_PAGE_WIDTH);
                      if (
                        idx !== newsIndex &&
                        idx >= 0 &&
                        idx < news.length
                      ) {
                        setNewsIndex(idx);
                      }
                    }}
                  >
                    {news.map((item) => (
                      <TouchableOpacity
                        key={`news-${item.id}`}
                        activeOpacity={0.9}
                        style={[
                          styles.newsCard,
                          {
                            backgroundColor: theme.surface,
                            borderColor: theme.cardBorder,
                            width: SCREEN_WIDTH - 40,
                          },
                        ]}
                        onPress={() => {
                          if (item.url) {
                            Linking.openURL(item.url).catch((err) =>
                              console.log("Failed to open news url", err)
                            );
                          }
                        }}
                      >
                        {item.imageUrl && (
                          <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.newsImage}
                          />
                        )}

                        <View style={styles.newsTextBlock}>
                          <View style={styles.newsMetaRow}>
                            {item.category && (
                              <View
                                style={[
                                  styles.newsCategoryPill,
                                  { backgroundColor: theme.accentSoft },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.newsCategoryText,
                                    { color: theme.accent },
                                  ]}
                                >
                                  {item.category.toUpperCase()}
                                </Text>
                              </View>
                            )}
                            {item.source && (
                              <Text
                                style={[
                                  styles.newsSource,
                                  { color: theme.textSoft },
                                ]}
                                numberOfLines={1}
                              >
                                {item.source}
                              </Text>
                            )}
                          </View>

                          <Text
                            style={[
                              styles.newsTitle,
                              { color: theme.textPrimary },
                            ]}
                            numberOfLines={2}
                          >
                            {item.title}
                          </Text>

                          {item.summary && (
                            <Text
                              style={[
                                styles.newsSummary,
                                { color: theme.textSoft },
                              ]}
                              numberOfLines={3}
                            >
                              {item.summary}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {news.length > 1 && (
                    <View style={styles.newsDotsRow}>
                      {news.map((n, index) => (
                        <View
                          key={`dot-${n.id}-${index}`}
                          style={[
                            styles.newsDot,
                            {
                              backgroundColor:
                                index === newsIndex
                                  ? theme.accent
                                  : theme.accentSoft,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>

            {/* MINI WATCHLIST */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                Mini Watchlist
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textSoft },
                ]}
              >
                Snapshot of key symbols
              </Text>
            </View>

            {miniWatchlist.length === 0 ? (
              <Text
                style={[styles.emptyText, { color: theme.textSoft }]}
              >
                No symbols to display right now.
              </Text>
            ) : (
              <View style={styles.watchlistGrid}>
                {miniWatchlist.map((asset, index) => (
                  <TouchableOpacity
                    key={`wl-${asset.symbol || "asset"}-${index}`}
                    style={[
                      styles.watchlistItem,
                      { backgroundColor: theme.surface },
                    ]}
                    onPress={() => openAssetDetail(asset.symbol)}
                  >
                    <Text
                      style={[
                        styles.watchlistSymbol,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {asset.symbol || "—"}
                    </Text>
                    <Text
                      style={[
                        styles.watchlistChange,
                        {
                          color:
                            asset.changePct >= 0
                              ? theme.success
                              : theme.danger,
                        },
                      ]}
                    >
                      {asset.changePct >= 0 ? "+" : ""}
                      {asset.changePct.toFixed(2)}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* AI SPOTLIGHT */}
            {spotlight.length > 0 && (
              <>
                <View style={styles.sectionHeaderRow}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: theme.textPrimary },
                    ]}
                  >
                    AI Spotlight
                  </Text>
                  <Text
                    style={[
                      styles.sectionSubtitle,
                      { color: theme.textSoft },
                    ]}
                  >
                    Strongest movers in your universe
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.spotlightScroll}
                >
                  {spotlight.map((item, index) => {
                    const isUp = item.changePct >= 0;
                    const direction = isUp ? "Bullish" : "Bearish";

                    const thesisText = isUp
                      ? "Upside momentum with supportive trend structure."
                      : "Downside pressure with elevated volatility.";

                    const riskText = isUp
                      ? "Watch for exhaustion if momentum fades."
                      : "Risk of sharp short-covering if sentiment flips.";

                    return (
                      <View
                        key={`spot-${item.symbol || "asset"}-${index}`}
                        style={styles.spotlightCardWrapper}
                      >
                        <GlowView intensity="soft" radius={22}>
                          <TouchableOpacity
                            style={[
                              styles.spotlightCard,
                              {
                                backgroundColor: theme.surface,
                                borderColor: theme.cardBorder,
                              },
                            ]}
                            onPress={() => openAssetDetail(item.symbol)}
                          >
                            <View style={styles.spotlightTopRow}>
                              <View>
                                <Text
                                  style={[
                                    styles.spotSymbol,
                                    { color: theme.textPrimary },
                                  ]}
                                >
                                  {item.symbol || "—"}
                                </Text>
                                <Text
                                  style={[
                                    styles.spotName,
                                    { color: theme.textSoft },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {item.name}
                                </Text>
                              </View>

                              <View
                                style={[
                                  styles.directionPill,
                                  {
                                    backgroundColor: (isUp
                                      ? theme.success
                                      : theme.danger) + "20",
                                    borderColor: isUp
                                      ? theme.success
                                      : theme.danger,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.directionPillText,
                                    {
                                      color: isUp
                                        ? theme.success
                                        : theme.danger,
                                    },
                                  ]}
                                >
                                  {direction}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.spotChangeRow}>
                              <Text
                                style={[
                                  styles.spotChange,
                                  {
                                    color: isUp
                                      ? theme.success
                                      : theme.danger,
                                  },
                                ]}
                              >
                                {isUp ? "+" : ""}
                                {item.changePct.toFixed(2)}%
                              </Text>
                              <Text
                                style={[
                                  styles.spotChangeLabel,
                                  { color: theme.textSoft },
                                ]}
                              >
                                Today
                              </Text>
                            </View>

                            <View style={styles.spotSparklineWrapper}>
                              <MiniSparkline
                                data={item.sparkline || []}
                                strokeColor={
                                  isUp ? theme.success : theme.danger
                                }
                                width={110}
                                height={40}
                              />
                            </View>

                            <Text
                              style={[
                                styles.spotThesis,
                                { color: theme.textPrimary },
                              ]}
                              numberOfLines={2}
                            >
                              {thesisText}
                            </Text>
                            <Text
                              style={[
                                styles.spotRisk,
                                { color: theme.textSoft },
                              ]}
                              numberOfLines={2}
                            >
                              Risk: {riskText}
                            </Text>
                          </TouchableOpacity>
                        </GlowView>
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}

            {/* TRENDING */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                Trending Now
              </Text>
            </View>

            {trendingList.length === 0 ? (
              <Text
                style={[styles.emptyText, { color: theme.textSoft }]}
              >
                No trending symbols to show right now.
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendingScroll}
              >
                {trendingList.map((asset, index) => (
                  <TouchableOpacity
                    key={`trend-${asset.symbol || "asset"}-${index}`}
                    style={[
                      styles.trendingCard,
                      {
                        backgroundColor: theme.surface,
                        borderColor: theme.cardBorder,
                      },
                    ]}
                    onPress={() => openAssetDetail(asset.symbol)}
                  >
                    <View style={styles.trendTopRow}>
                      <Text
                        style={[
                          styles.trendSymbol,
                          { color: theme.textPrimary },
                        ]}
                      >
                        {asset.symbol || "—"}
                      </Text>
                      <Text
                        style={[
                          styles.trendChange,
                          {
                            color:
                              asset.changePct >= 0
                                ? theme.success
                                : theme.danger,
                          },
                        ]}
                      >
                        {asset.changePct >= 0 ? "+" : ""}
                        {asset.changePct.toFixed(2)}%
                      </Text>
                    </View>

                    <MiniSparkline
                      data={asset.sparkline || []}
                      strokeColor={
                        asset.changePct >= 0
                          ? theme.success
                          : theme.danger
                      }
                      width={110}
                      height={40}
                    />

                    <Text
                      style={[
                        styles.trendName,
                        { color: theme.textSoft },
                      ]}
                      numberOfLines={1}
                    >
                      {asset.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* COMMUNITY */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                Community Pulse
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.communityCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
              onPress={() => navigation.navigate("Planet")}
              activeOpacity={0.9}
            >
              <Ionicons
                name="people-outline"
                size={22}
                color={theme.accent}
              />
              <Text
                style={[
                  styles.communityText,
                  { color: theme.textPrimary },
                ]}
                numberOfLines={2}
              >
                See what traders are focusing on today →
              </Text>
            </TouchableOpacity>

            {/* QUICK ACTIONS */}
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                Quick Actions
              </Text>
            </View>

            <GlowView intensity="soft" radius={20} style={styles.quickGlow}>
              <View style={styles.quickRow}>
                <TouchableOpacity
                  style={[
                    styles.quickButton,
                    { backgroundColor: theme.surface },
                  ]}
                  onPress={() => openAIChat()}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={20}
                    color={theme.accent}
                  />
                  <Text
                    style={[
                      styles.quickText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    Ask AI
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickButton,
                    { backgroundColor: theme.surface },
                  ]}
                  onPress={openAlerts}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={theme.accent}
                  />
                  <Text
                    style={[
                      styles.quickText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    Alerts
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickButton,
                    { backgroundColor: theme.surface },
                  ]}
                  onPress={() => navigation.navigate("Portfolio")}
                >
                  <Ionicons
                    name="pie-chart-outline"
                    size={20}
                    color={theme.accent}
                  />
                  <Text
                    style={[
                      styles.quickText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    Portfolio
                  </Text>
                </TouchableOpacity>
              </View>
            </GlowView>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </GradientBackground>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "800",
  },
  appSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  aiStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    columnGap: 4,
  },
  aiStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chatCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerStatsPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
    columnGap: 8,
  },
  headerStatsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  headerStatsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  briefGlow: {
    marginBottom: 18,
  },
  briefCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
  },
  briefHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  briefLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  briefSubtitle: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "500",
  },
  briefBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginRight: 6,
  },
  livePillText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  sentimentPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  briefMetaColumn: {
    alignItems: "flex-end",
    rowGap: 6,
  },
  viewAlertsLink: {
    fontSize: 12,
    fontWeight: "600",
  },
  briefMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  briefMetaText: {
    fontSize: 11,
    fontWeight: "500",
  },
  briefLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 6,
  },
  briefLoadingText: {
    fontSize: 13,
  },
  briefTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  briefText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  briefCTARow: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 4,
    alignItems: "stretch",
    flexWrap: "wrap",
  },
  primaryCTA: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
    minHeight: 40,
  },
  primaryCTAText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    flexShrink: 1,
  },
  secondaryCTA: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    marginTop: 6,
  },
  secondaryCTAText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    flexShrink: 1,
  },
  sectionHeaderRow: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    marginBottom: 12,
  },
  signalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  signalCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  signalLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
  },
  signalValueGreen: {
    fontSize: 14,
    fontWeight: "700",
  },
  signalValueRed: {
    fontSize: 14,
    fontWeight: "700",
  },
  signalValueBlue: {
    fontSize: 14,
    fontWeight: "700",
  },
  newsCarouselWrapper: {
    marginBottom: 18,
    marginHorizontal: -20,
  },
  newsScrollContent: {
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  newsCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  newsImage: {
    width: "100%",
    height: 140,
  },
  newsTextBlock: {
    padding: 12,
  },
  newsMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  newsCategoryPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newsCategoryText: {
    fontSize: 10,
    fontWeight: "700",
  },
  newsSource: {
    fontSize: 11,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  newsSummary: {
    fontSize: 12,
  },
  newsDotsRow: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 6,
    gap: 6,
  },
  newsDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  watchlistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 8,
    marginBottom: 8,
  },
  watchlistItem: {
    flexBasis: "48%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  watchlistSymbol: {
    fontSize: 14,
    fontWeight: "700",
  },
  watchlistChange: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
  },
  spotlightScroll: {
    paddingVertical: 4,
    paddingBottom: 10,
  },
  spotlightCardWrapper: {
    marginRight: 12,
  },
  spotlightCard: {
    width: 210,
    borderWidth: 1,
    borderRadius: 22,
    padding: 12,
  },
  spotlightTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  spotSymbol: {
    fontSize: 16,
    fontWeight: "700",
  },
  spotName: {
    fontSize: 11,
    marginTop: 2,
  },
  directionPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  directionPillText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  spotChangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
  },
  spotChange: {
    fontSize: 18,
    fontWeight: "700",
  },
  spotChangeLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  spotSparklineWrapper: {
    marginTop: 8,
    marginBottom: 6,
  },
  spotThesis: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  spotRisk: {
    fontSize: 11,
  },
  trendingScroll: {
    paddingVertical: 4,
  },
  trendingCard: {
    width: 150,
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    marginRight: 12,
  },
  trendTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  trendSymbol: {
    fontSize: 15,
    fontWeight: "700",
  },
  trendChange: {
    fontSize: 13,
    fontWeight: "600",
  },
  trendName: {
    fontSize: 11,
    marginTop: 4,
  },
  communityCard: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  communityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
    flexWrap: "wrap",
  },
  quickGlow: {
    marginTop: 4,
  },
  quickRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
  },
});
