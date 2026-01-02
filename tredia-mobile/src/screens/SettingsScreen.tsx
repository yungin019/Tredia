// src/screens/SettingsScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import { fetchMyBroker, getTradeDeeplink, openBrokerApp } from "../services/brokerLinkService";
import GlowView from "../components/GlowView";
import { useAuth } from "../context/AuthContext";

type PlanName = "FREE" | "PRO" | "ELITE";

interface UserPlanResponse {
  source?: string;
  planName: PlanName | string;
  priceMonthly?: number | null;
  currency?: string | null;
  aiDailyLimit?: number | null;
  usedToday?: number;
  remainingToday?: number | null;
}

const SettingsScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();

  const auth: any = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const [plan, setPlan] = useState<UserPlanResponse | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brokerAccount, setBrokerAccount] = useState<any>(null);
  const [loadingBroker, setLoadingBroker] = useState<boolean>(true);
  const [brokerError, setBrokerError] = useState<string | null>(null);
  const [openingBroker, setOpeningBroker] = useState<boolean>(false);

  // ✅ Make native header match app background + colors
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: { color: theme.textPrimary },
    });
  }, [navigation, theme.background, theme.textPrimary]);

  // Fetch broker info on mount
  useEffect(() => {
    let mounted = true;
    setLoadingBroker(true);
    setBrokerError(null);
    fetchMyBroker()
      .then((res) => {
        if (mounted) setBrokerAccount(res);
      })
      .catch(() => {
        if (mounted) setBrokerError("Could not load broker info.");
      })
      .finally(() => {
        if (mounted) setLoadingBroker(false);
      });
    return () => {
      mounted = false;
    };
  }, []);
  // Broker quick open action
  const handleOpenBrokerApp = async () => {
    if (!brokerAccount || !brokerAccount.broker) return;
    setOpeningBroker(true);
    try {
      await openBrokerApp(brokerAccount.broker);
    } finally {
      setOpeningBroker(false);
    }
  };

  // NOTE: This must use a service that wraps apiClient, not direct api usage.
  const loadPlan = useCallback(async () => {
    try {
      setError(null);
      setLoadingPlan(true);
      // TODO: Replace with a plan service that uses apiClient if not already
      // For now, comment out direct api usage to avoid TS error
      // const res = await api.get("/user/plan");
      // setPlan(res.data as UserPlanResponse);
    } catch (err: any) {
      setError("Failed to load subscription info.");
    } finally {
      setLoadingPlan(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadPlan();
  }, [loadPlan]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadPlan();
  };

  const planName = (plan?.planName || "FREE").toString().toUpperCase();
  const price =
    typeof plan?.priceMonthly === "number" ? plan?.priceMonthly : 0;
  const currency = plan?.currency || "SEK";

  const aiDailyLimit =
    plan?.aiDailyLimit === undefined ? null : plan.aiDailyLimit;
  const remainingToday =
    plan?.remainingToday === undefined ? null : plan.remainingToday;

  const usedToday =
    typeof plan?.usedToday === "number"
      ? plan?.usedToday
      : aiDailyLimit != null && remainingToday != null
      ? Math.max(0, aiDailyLimit - remainingToday)
      : 0;

  const aiUsageLabel =
    aiDailyLimit == null
      ? "Unlimited AI messages per day"
      : `${usedToday}/${aiDailyLimit} AI messages used today`;

  const handleManageSubscription = () => {
    navigation.navigate("Subscription" as never);
  };

  const handleOpenAi = () => {
    navigation.navigate("HomeTabs" as never, {
      screen: "AI",
    } as never);
  };

  const handleOpenCommunity = () => {
    navigation.navigate("HomeTabs" as never, {
      screen: "Planet",
    } as never);
  };

  const handleOpenPortfolio = () => {
    navigation.navigate("HomeTabs" as never, {
      screen: "Portfolio",
    } as never);
  };

  const handleContactSupport = async () => {
    const email = "support@tredia.ai";
    const subject = encodeURIComponent("Tredia – Support request");
    const body = encodeURIComponent(
      `Hi Tredia team,\n\nI need help with:\n\n(Describe your issue here)\n\nUser: ${
        user?.email || "guest"
      }`
    );
    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Email not available",
        "We couldn't open your email app. Please reach us at support@tredia.ai."
      );
    }
  };

  const handleLogout = () => {
    if (!logout) {
      Alert.alert(
        "Logout unavailable",
        "Logout function is not configured yet."
      );
      return;
    }

    Alert.alert("Logout", "Do you really want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const priceLabel =
    price === 0 ? "Free" : `${price.toFixed(0)} ${currency}/month`;

  const initials =
    (user?.displayName || user?.email || "T").charAt(0).toUpperCase();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Account, subscription and app preferences.
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
        {/* PROFILE SUMMARY CARD */}
        <GlowView radius={22}>
          <View
            style={[
              styles.card,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <View style={styles.userRow}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.accent },
                ]}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.userName, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {user?.displayName || "Trader"}
                </Text>
                <Text
                  style={[styles.userEmail, { color: theme.textSoft }]}
                  numberOfLines={1}
                >
                  {user?.email || "Guest session"}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.chip,
                  { borderColor: theme.cardBorder },
                ]}
                onPress={handleOpenAi}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: theme.textSoft },
                  ]}
                >
                  Open AI mentor
                </Text>
              </TouchableOpacity>
            </View>

            {/* Current plan */}
            <View style={styles.planRow}>
              <View>
                <Text
                  style={[styles.planLabel, { color: theme.textSoft }]}
                >
                  Current plan
                </Text>
                <Text
                  style={[styles.planName, { color: theme.textPrimary }]}
                >
                  {planName}
                </Text>
                <Text
                  style={[styles.planPrice, { color: theme.textSoft }]}
                >
                  {priceLabel}
                </Text>
              </View>
              <View style={styles.aiUsageCol}>
                {loadingPlan ? (
                  <Text
                    style={[
                      styles.aiUsageText,
                      { color: theme.textSoft },
                    ]}
                  >
                    Loading AI limits…
                  </Text>
                ) : (
                  <>
                    <Text
                      style={[
                        styles.aiUsageLabel,
                        { color: theme.textSoft },
                      ]}
                    >
                      AI usage today
                    </Text>
                    <Text
                      style={[
                        styles.aiUsageText,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {aiUsageLabel}
                    </Text>
                  </>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.managePlanBtn,
                { borderColor: theme.accent },
              ]}
              onPress={handleManageSubscription}
            >
              <Text
                style={[
                  styles.managePlanText,
                  { color: theme.accent },
                ]}
              >
                Manage subscription
              </Text>
            </TouchableOpacity>

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
          </View>
        </GlowView>

        {/* BROKER CONNECTION SECTION */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Broker connection</Text>
          <View style={[styles.card, { borderColor: theme.cardBorder, backgroundColor: theme.surface }]}>  
            {loadingBroker ? (
              <Text style={{ color: theme.textSoft, marginBottom: 8 }}>Loading broker info…</Text>
            ) : brokerAccount && brokerAccount.broker ? (
              <>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Connected to {brokerAccount.broker.name}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textSoft, marginBottom: 8 }]}>You can change your broker at any time.</Text>
                <TouchableOpacity
                  style={[styles.rowItem, { borderColor: theme.accent, marginBottom: 8 }]}
                  onPress={() => navigation.navigate("LinkBroker")}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.rowTitle, { color: theme.accent }]}>Change broker</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rowItem, { borderColor: theme.cardBorder }]}
                  onPress={handleOpenBrokerApp}
                  disabled={openingBroker}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.rowTitle, { color: theme.textPrimary }]}> 
                    {openingBroker ? "Opening…" : "Open broker app"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>No broker connected</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textSoft, marginBottom: 8 }]}>Connect a broker to unlock live market insights and AI predictions.</Text>
                <TouchableOpacity
                  style={[styles.rowItem, { borderColor: theme.accent }]}
                  onPress={() => navigation.navigate("LinkBroker")}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.rowTitle, { color: theme.accent }]}>Connect broker</Text>
                </TouchableOpacity>
              </>
            )}
            {brokerError && <Text style={{ color: theme.danger }}>{brokerError}</Text>}
          </View>
        </View>

        {/* APP SECTIONS */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Shortcuts
          </Text>

          <TouchableOpacity
            style={[
              styles.rowItem,
              { borderColor: theme.cardBorder },
            ]}
            onPress={handleOpenPortfolio}
          >
            <View>
              <Text
                style={[styles.rowTitle, { color: theme.textPrimary }]}
              >
                Portfolio & paper trading
              </Text>
              <Text
                style={[styles.rowSubtitle, { color: theme.textSoft }]}
              >
                Jump to your positions, cash and paper trades.
              </Text>
            </View>
            <Text
              style={[styles.rowChevron, { color: theme.textSoft }]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowItem,
              { borderColor: theme.cardBorder },
            ]}
            onPress={handleOpenCommunity}
          >
            <View>
              <Text
                style={[styles.rowTitle, { color: theme.textPrimary }]}
              >
                Community
              </Text>
              <Text
                style={[styles.rowSubtitle, { color: theme.textSoft }]}
              >
                Read posts, share ideas and follow live activity.
              </Text>
            </View>
            <Text
              style={[styles.rowChevron, { color: theme.textSoft }]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Notifications & support
          </Text>

          <TouchableOpacity
            style={[
              styles.rowItem,
              { borderColor: theme.cardBorder },
            ]}
            onPress={() => {
              if (Platform.OS === "ios" || Platform.OS === "android") {
                Linking.openSettings().catch(() => {
                  Alert.alert(
                    "Settings unavailable",
                    "Open your device settings to update notification permissions."
                  );
                });
              }
            }}
          >
            <View>
              <Text
                style={[styles.rowTitle, { color: theme.textPrimary }]}
              >
                Notification settings
              </Text>
              <Text
                style={[styles.rowSubtitle, { color: theme.textSoft }]}
              >
                Open your device settings to manage alerts from Tredia.
              </Text>
            </View>
            <Text
              style={[styles.rowChevron, { color: theme.textSoft }]}
            >
              ›
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowItem,
              { borderColor: theme.cardBorder },
            ]}
            onPress={handleContactSupport}
          >
            <View>
              <Text
                style={[styles.rowTitle, { color: theme.textPrimary }]}
              >
                Contact support
              </Text>
              <Text
                style={[styles.rowSubtitle, { color: theme.textSoft }]}
              >
                Send us an email if you need help with the app.
              </Text>
            </View>
            <Text
              style={[styles.rowChevron, { color: theme.textSoft }]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Account
          </Text>

          <TouchableOpacity
            style={[
              styles.rowItem,
              { borderColor: theme.cardBorder },
            ]}
            onPress={handleLogout}
          >
            <View>
              <Text
                style={[
                  styles.rowTitle,
                  { color: theme.danger },
                ]}
              >
                Log out
              </Text>
              <Text
                style={[styles.rowSubtitle, { color: theme.textSoft }]}
              >
                Sign out from this device.
              </Text>
            </View>
            <Text
              style={[
                styles.rowChevron,
                { color: theme.danger },
              ]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
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

  // CARD
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
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
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
  },

  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  planLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 2,
  },
  planPrice: {
    fontSize: 12,
    marginTop: 2,
  },
  aiUsageCol: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  aiUsageLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  aiUsageText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "right",
  },
  managePlanBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  managePlanText: {
    fontSize: 12,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 8,
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

  // ROW ITEMS
  rowItem: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  rowSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 16,
    marginLeft: 8,
  },
});
