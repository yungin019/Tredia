// src/screens/SubscriptionScreen.tsx

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
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
import GlowView from "../components/GlowView";
import {
  fetchPlans,
  fetchUserPlan,
  type PlanInfo,
  type UserPlanInfo,
} from "../services/planClient";

type SubscriptionScreenProps = {
  navigation: any;
};

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  navigation,
}) => {
  const theme: any = useTheme();

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlanInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [plansRes, userPlanRes] = await Promise.all([
        fetchPlans(),
        fetchUserPlan(),
      ]);

      setPlans(plansRes);
      setUserPlan(userPlanRes);
    } catch (err: any) {
      console.log("[SubscriptionScreen] load error:", err?.message || err);
      setError("Failed to load subscription data.");
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

  const currentName = (userPlan?.planName || "FREE").toString();

  const formatPrice = (p: PlanInfo | UserPlanInfo | null) => {
    if (!p) return "—";
    const price =
      typeof p.priceMonthly === "number" ? p.priceMonthly : 0;
    const currency = p.currency || "SEK";
    if (price === 0) return "Free";
    return `${price.toFixed(0)} ${currency}/month`;
  };

  if (loading && !refreshing) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  if (error && !plans.length) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={{ color: theme.textPrimary, marginBottom: 8 }}
        >
          {error}
        </Text>
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

  return (
    <View
      style={[styles.root, { backgroundColor: theme.background }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: theme.textPrimary }]}
        >
          Subscription
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.textSoft }]}
        >
          Pick how deep you want Tredia’s Super AI to work for you.
        </Text>

        {/* 🔹 Compact tier hint line */}
        <Text
          style={[styles.tiersHint, { color: theme.textSoft }]}
          numberOfLines={1}
        >
          FREE · 10/day — PRO · 100/day — ELITE · ∞
        </Text>

        {userPlan && (
          <View style={styles.currentPlanWrapper}>
            {/* GlowView without intensity prop (uses default) */}
            <GlowView radius={18}>
              <View
                style={[
                  styles.currentPlanCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.currentPlanLabel,
                    { color: theme.textSoft },
                  ]}
                >
                  Current plan
                </Text>
                <Text
                  style={[
                    styles.currentPlanName,
                    { color: theme.textPrimary },
                  ]}
                >
                  {userPlan.planName}
                </Text>
                <Text
                  style={[
                    styles.currentPlanPrice,
                    { color: theme.textSoft },
                  ]}
                >
                  {formatPrice(userPlan)}
                </Text>

                <View style={styles.currentPlanRow}>
                  <Text
                    style={[
                      styles.currentPlanDetail,
                      { color: theme.textSoft },
                    ]}
                  >
                    AI limit:{" "}
                    {userPlan.aiDailyLimit === null
                      ? "Unlimited daily messages"
                      : `${userPlan.aiDailyLimit} messages / day`}
                  </Text>
                  {typeof userPlan.remainingToday === "number" && (
                    <Text
                      style={[
                        styles.currentPlanDetail,
                        { color: theme.accent },
                      ]}
                    >
                      {userPlan.remainingToday} left today
                    </Text>
                  )}
                </View>
              </View>
            </GlowView>
          </View>
        )}
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
        {/* PLAN LIST */}
        {plans.map((plan) => {
          const isCurrent =
            currentName.toUpperCase() ===
            plan.name.toUpperCase();
          const isFree = plan.name === "FREE";
          const aiLimit =
            plan.aiDailyLimit === null
              ? "Unlimited AI messages / day"
              : `${plan.aiDailyLimit} AI messages / day`;

          return (
            <View key={plan.name} style={styles.planOuter}>
              {/* GlowView without intensity prop */}
              <GlowView radius={20}>
                <View
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: theme.surface,
                      borderColor: isCurrent
                        ? theme.accent
                        : theme.cardBorder,
                    },
                  ]}
                >
                  <View style={styles.planHeaderRow}>
                    <View>
                      <Text
                        style={[
                          styles.planName,
                          { color: theme.textPrimary },
                        ]}
                      >
                        {plan.name}
                      </Text>
                      <Text
                        style={[
                          styles.planPrice,
                          {
                            color: isFree
                              ? theme.accent
                              : theme.textPrimary,
                          },
                        ]}
                      >
                        {formatPrice(plan)}
                      </Text>
                    </View>

                    {isCurrent && (
                      <View
                        style={[
                          styles.currentBadge,
                          {
                            borderColor: theme.accent,
                            backgroundColor: `${theme.accent}15`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.currentBadgeText,
                            { color: theme.accent },
                          ]}
                        >
                          ACTIVE
                        </Text>
                      </View>
                    )}
                  </View>

                  {plan.description && (
                    <Text
                      style={[
                        styles.planDescription,
                        { color: theme.textSoft },
                      ]}
                    >
                      {plan.description}
                    </Text>
                  )}

                  <View style={styles.planDetailRow}>
                    <Text
                      style={[
                        styles.planDetail,
                        { color: theme.textSoft },
                      ]}
                    >
                      {aiLimit}
                    </Text>
                  </View>

                  <View style={styles.planButtonsRow}>
                    {isCurrent ? (
                      <View
                        style={[
                          styles.currentChip,
                          {
                            borderColor: theme.cardBorder,
                            backgroundColor: theme.surface,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            color: theme.textSoft,
                            fontSize: 11,
                          }}
                        >
                          You&apos;re on this plan
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.chooseBtn,
                          { backgroundColor: theme.accent },
                        ]}
                        onPress={() =>
                          navigation.navigate("Paywall", {
                            plan,
                            currentPlanName: currentName,
                          })
                        }
                      >
                        <Text
                          style={{
                            color: "#020617",
                            fontWeight: "700",
                            fontSize: 13,
                          }}
                        >
                          Choose {plan.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </GlowView>
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
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
  tiersHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "500",
  },
  currentPlanWrapper: {
    marginTop: 10,
  },
  currentPlanCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  currentPlanLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 18,
    fontWeight: "700",
  },
  currentPlanPrice: {
    fontSize: 13,
    marginTop: 2,
  },
  currentPlanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  currentPlanDetail: {
    fontSize: 11,
  },

  // PLAN CARDS
  planOuter: {
    marginTop: 14,
  },
  planCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  planHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
  },
  planPrice: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
  },
  currentBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  planDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  planDetailRow: {
    marginTop: 8,
  },
  planDetail: {
    fontSize: 11,
  },
  planButtonsRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  currentChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chooseBtn: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  // FALLBACK
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
