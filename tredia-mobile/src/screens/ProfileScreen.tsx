// src/screens/ProfileScreen.tsx

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
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/apiClient";
import GlowView from "../components/GlowView";
import NeonButton from "../components/NeonButton";

type PlanName = "FREE" | "PRO" | "ELITE";

interface UserPlanResponse {
  planName: PlanName | string;
  priceMonthly?: number | null;
  currency?: string | null;
  aiDailyLimit?: number | null;
  usedToday?: number;
  remainingToday?: number | null;
}

interface Position {
  id: number;
  symbol: string;
  quantity: number;
  avgPrice: number;
  marketValue?: number;
  unrealizedPnl?: number;
}

interface PortfolioResponse {
  cash: number;
  startingCash: number;
  baseCurrency: string;
  positions: Position[];
}

const ProfileScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();

  const auth: any = useAuth();
  const user = auth?.user;

  const [plan, setPlan] = useState<UserPlanResponse | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // ✅ Make native header match app background + colors
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: { color: theme.textPrimary },
    });
  }, [navigation, theme.background, theme.textPrimary]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [planRes, portRes] = await Promise.all([
        api.get("/user/plan"),
        api.get("/paper/portfolio"),
      ]);

      setPlan(planRes.data as UserPlanResponse);
      setPortfolio(portRes.data as PortfolioResponse);
    } catch (err: any) {
      console.log("[Profile] loadData error:", err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadData();
  };

  const initials =
    (user?.displayName || user?.email || "T").charAt(0).toUpperCase();

  const planName = (plan?.planName || "FREE").toString().toUpperCase();
  const price =
    typeof plan?.priceMonthly === "number" ? plan.priceMonthly : 0;
  const currency = plan?.currency || "SEK";

  const aiDailyLimit =
    plan?.aiDailyLimit === undefined ? null : plan.aiDailyLimit;
  const remainingToday =
    plan?.remainingToday === undefined ? null : plan.remainingToday;
  const usedToday =
    typeof plan?.usedToday === "number"
      ? plan.usedToday
      : aiDailyLimit != null && remainingToday != null
      ? Math.max(0, aiDailyLimit - remainingToday)
      : 0;

  const aiUsageLabel =
    aiDailyLimit == null
      ? "Unlimited AI messages per day"
      : `${usedToday}/${aiDailyLimit} AI messages today`;

  const cash = portfolio?.cash ?? 0;
  const startingCash = portfolio?.startingCash ?? 0;
  const baseCurrency = portfolio?.baseCurrency ?? "USD";
  const positions = portfolio?.positions ?? [];

  const investedValue =
    positions.reduce(
      (sum, p) => sum + (p.marketValue ?? p.quantity * p.avgPrice),
      0
    ) || 0;

  const totalEquity = cash + investedValue;
  const pnl = totalEquity - startingCash;
  const pnlPct = startingCash > 0 ? (pnl / startingCash) * 100 : 0;

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
    (p) => (p.unrealizedPnl ?? 0) > 0
  ).length;
  const losingPositions = positions.filter(
    (p) => (p.unrealizedPnl ?? 0) < 0
  ).length;

  const handleOpenAi = () => {
    navigation.navigate("HomeTabs", { screen: "AI" });
  };

  const handleOpenPortfolio = () => {
    navigation.navigate("HomeTabs", { screen: "Portfolio" });
  };

  const handleOpenCommunity = () => {
    navigation.navigate("HomeTabs", { screen: "Planet" });
  };

  const handleOpenSubscription = () => {
    navigation.navigate("Subscription");
  };

  if (loading && !refreshing) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Profile
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Your account, AI mentor and trading cockpit in one view.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        {/* USER + PLAN HERO */}
        <GlowView radius={22}>
          <View
            style={[
              styles.heroCard,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroUserRow}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View>
                  <Text
                    style={[
                      styles.userName,
                      { color: theme.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {user?.displayName || "Trader"}
                  </Text>
                  <Text
                    style={[
                      styles.userEmail,
                      { color: theme.textSoft },
                    ]}
                    numberOfLines={1}
                  >
                    {user?.email || "Guest session"}
                  </Text>
                </View>
              </View>

              <View style={styles.planBadge}>
                <Text
                  style={[
                    styles.planBadgeLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Plan
                </Text>
                <Text
                  style={[
                    styles.planBadgeName,
                    { color: theme.textPrimary },
                  ]}
                >
                  {planName}
                </Text>
              </View>
            </View>

            {/* AI USAGE */}
            <View style={styles.aiRow}>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.aiLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  AI mentor today
                </Text>
                <Text
                  style={[
                    styles.aiValue,
                    { color: theme.textPrimary },
                  ]}
                >
                  {aiUsageLabel}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.aiChip,
                  { borderColor: theme.accent },
                ]}
                onPress={handleOpenAi}
              >
                <Text
                  style={[
                    styles.aiChipText,
                    { color: theme.accent },
                  ]}
                >
                  Open AI
                </Text>
              </TouchableOpacity>
            </View>

            {/* EQUITY SNAPSHOT */}
            <View style={styles.equityRow}>
              <View style={styles.equityCol}>
                <Text
                  style={[
                    styles.equityLabel,
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
              <View style={styles.equityColRight}>
                <Text
                  style={[
                    styles.equityLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  P&amp;L vs start
                </Text>
                <Text
                  style={[
                    styles.pnlValue,
                    { color: pnlColor },
                  ]}
                >
                  {pnl >= 0 ? "+" : ""}
                  {pnl.toFixed(2)} {baseCurrency} (
                  {pnlPct.toFixed(2)}%)
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
                  {positions.length} open position
                  {positions.length === 1 ? "" : "s"}
                </Text>
              </View>
            </View>
          </View>
        </GlowView>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Quick actions
          </Text>

          <View style={styles.quickRow}>
            <NeonButton
              label="Ask Tredia AI"
              onPress={handleOpenAi}
              glowColor={theme.accent}
            />
          </View>

          <View style={styles.quickRow}>
            <NeonButton
              label="Open portfolio"
              onPress={handleOpenPortfolio}
              glowColor={theme.accent}
            />
          </View>

          <View style={styles.quickRow}>
            <NeonButton
              label="Explore community"
              onPress={handleOpenCommunity}
              glowColor={theme.accent}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.managePlanBtn,
              { borderColor: theme.cardBorder },
            ]}
            onPress={handleOpenSubscription}
          >
            <Text
              style={[
                styles.managePlanText,
                { color: theme.textSoft },
              ]}
            >
              Manage subscription & AI limits
            </Text>
          </TouchableOpacity>
        </View>

        {/* SMALL SUMMARY */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Snapshot
          </Text>
          <Text
            style={[styles.summaryText, { color: theme.textSoft }]}
          >
            • Wins: {winningPositions} · Losses: {losingPositions} · Open
            positions: {positions.length}
          </Text>
          <Text
            style={[styles.summaryText, { color: theme.textSoft }]}
          >
            • Cash: {cash.toFixed(2)} {baseCurrency} · Invested:{" "}
            {investedValue.toFixed(2)} {baseCurrency}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // HERO CARD
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heroUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 18,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  planBadge: {
    alignItems: "flex-end",
  },
  planBadgeLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  planBadgeName: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },

  aiRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  aiLabel: {
    fontSize: 11,
  },
  aiValue: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  aiChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  aiChipText: {
    fontSize: 11,
    fontWeight: "600",
  },

  equityRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  equityCol: {
    flex: 1,
  },
  equityColRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  equityLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  equityValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  pnlValue: {
    fontSize: 13,
    fontWeight: "600",
  },

  allocWrapper: {
    marginTop: 10,
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

  // SECTIONS
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  quickRow: {
    marginBottom: 8,
  },
  managePlanBtn: {
    marginTop: 4,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },
  managePlanText: {
    fontSize: 12,
    fontWeight: "500",
  },

  summaryText: {
    fontSize: 12,
    marginTop: 2,
  },
});
