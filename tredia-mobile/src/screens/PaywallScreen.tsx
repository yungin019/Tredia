import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import GlowView from "../components/GlowView";

// Route params shape coming from SubscriptionScreen
type PaywallParams = {
  plan: {
    name: string;
    description?: string | null;
    priceMonthly?: number | null;
    currency?: string | null;
    aiDailyLimit?: number | null;
  };
  currentPlanName?: string;
};

type PaywallScreenProps = {
  navigation: any;
  route: {
    params: PaywallParams;
  };
};

const PaywallScreen: React.FC<PaywallScreenProps> = ({
  navigation,
  route,
}) => {
  const theme: any = useTheme();
  const { plan, currentPlanName } = route.params || {};
  const planName = plan?.name ?? "PRO";

  const isUpgradeFromFree =
    (currentPlanName || "FREE").toUpperCase() === "FREE" &&
    planName.toUpperCase() !== "FREE";

  const priceLabel = useMemo(() => {
    if (!plan) return "—";
    const price = typeof plan.priceMonthly === "number" ? plan.priceMonthly : 0;
    const currency = plan.currency || "SEK";
    if (price === 0) return "Free";
    return `${price.toFixed(0)} ${currency}/month`;
  }, [plan]);

  const aiLimitLabel = useMemo(() => {
    if (!plan) return "";
    if (plan.aiDailyLimit === null || plan.aiDailyLimit === undefined) {
      return "Unlimited AI messages per day";
    }
    return `${plan.aiDailyLimit} AI messages per day`;
  }, [plan]);

  const perkBullets = useMemo(() => {
    const upper = planName.toUpperCase();
    if (upper === "ELITE") {
      return [
        "Priority AI mentor with deep, structured breakdowns",
        "Unlimited AI chat sessions every day",
        "Advanced community tools and sentiment dashboards",
        "Full portfolio tools, alerts and paper trading cockpit",
      ];
    }
    if (upper === "PRO") {
      return [
        "Full Tredia AI mentor for daily market questions",
        "Higher daily AI message limit for active traders",
        "Community insights and trending posts unlocked",
        "Paper portfolio + trade simulations to practice risk",
      ];
    }
    // FREE (paywall will almost never show this, but keep it safe)
    return [
      "Basic access to Tredia AI with limited messages",
      "Access to core dashboards and market overview",
      "Start with paper trading and simple portfolio view",
    ];
  }, [planName]);

  const handleContinue = () => {
    // 🔒 Here is where you plug RevenueCat / StoreKit / Play Billing.
    // For now we just navigate back to the Subscription screen.
    navigation.navigate("Subscription");
  };

  const handleLater = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Upgrade to {planName}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Unlock deeper AI coaching, richer analytics and a more powerful
          trading cockpit.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PLAN HERO */}
        <GlowView radius={22}>
          <View
            style={[
              styles.planCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.accent,
              },
            ]}
          >
            <Text
              style={[styles.planLabel, { color: theme.textSoft }]}
            >
              You&apos;re choosing
            </Text>
            <Text
              style={[styles.planName, { color: theme.textPrimary }]}
            >
              {planName}
            </Text>
            <Text
              style={[styles.planPrice, { color: theme.accent }]}
            >
              {priceLabel}
            </Text>

            <Text
              style={[
                styles.planDescription,
                { color: theme.textSoft },
              ]}
            >
              {plan?.description ||
                (planName === "ELITE"
                  ? "Elite mentor access for traders who want depth, structure and priority AI."
                  : planName === "PRO"
                  ? "The main Tredia experience for active traders who want daily AI support."
                  : "Core access to Tredia with a limited but real AI mentor.")}
            </Text>

            <View style={styles.currentPlanRow}>
              <Text
                style={[
                  styles.currentPlanText,
                  { color: theme.textSoft },
                ]}
              >
                Current plan:{" "}
                <Text style={{ color: theme.textPrimary }}>
                  {currentPlanName || "FREE"}
                </Text>
              </Text>
              <Text
                style={[
                  styles.currentPlanText,
                  { color: theme.textSoft },
                ]}
              >
                AI:{" "}
                <Text style={{ color: theme.textPrimary }}>
                  {aiLimitLabel}
                </Text>
              </Text>
            </View>

            {isUpgradeFromFree && (
              <View
                style={[
                  styles.upgradeBadge,
                  {
                    backgroundColor: `${theme.accent}20`,
                    borderColor: theme.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.upgradeBadgeText,
                    { color: theme.accent },
                  ]}
                >
                  Big step up from FREE: more AI depth, more sessions, more
                  tools.
                </Text>
              </View>
            )}
          </View>
        </GlowView>

        {/* BENEFITS */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            What you unlock with {planName}
          </Text>
          {perkBullets.map((p, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View
                style={[
                  styles.bulletDot,
                  { backgroundColor: theme.accent },
                ]}
              />
              <Text
                style={[styles.bulletText, { color: theme.textSoft }]}
              >
                {p}
              </Text>
            </View>
          ))}
        </View>

        {/* AI FOCUS SECTION */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.textPrimary }]}
          >
            Tredia AI ≠ signal spam
          </Text>
          <Text
            style={[styles.sectionBody, { color: theme.textSoft }]}
          >
            Tredia AI doesn&apos;t shout “BUY NOW” or “100x coin”. It helps you
            understand scenarios, risk, probabilities and position sizing — so
            you stay calm when markets get noisy.
          </Text>
          <Text
            style={[styles.sectionBody, { color: theme.textSoft }]}
          >
            With {planName}, you can ask more questions, go deeper into your
            portfolio and build your own process instead of chasing hype.
          </Text>
        </View>

        {/* DEVICE / STORE NOTE */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionHintTitle,
              { color: theme.textSoft },
            ]}
          >
            Billing handled by your store
          </Text>
          <Text
            style={[styles.sectionHintText, { color: theme.textSoft }]}
          >
            Your subscription will be managed securely by{" "}
            {Platform.OS === "ios" ? "Apple" : "Google"}. You can cancel, pause
            or change plans directly in your device settings.
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* BOTTOM CTA BAR */}
      <View
        style={[
          styles.bottomBar,
          { borderTopColor: theme.cardBorder },
        ]}
      >
        <View style={styles.bottomTextCol}>
          <Text
            style={[styles.bottomTitle, { color: theme.textPrimary }]}
          >
            Continue with {planName}
          </Text>
          <Text
            style={[styles.bottomSubtitle, { color: theme.textSoft }]}
          >
            You can downgrade or cancel anytime in your store settings.
          </Text>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={[
              styles.laterBtn,
              { borderColor: theme.cardBorder },
            ]}
            onPress={handleLater}
          >
            <Text
              style={[
                styles.laterText,
                { color: theme.textSoft },
              ]}
            >
              Maybe later
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              { backgroundColor: theme.accent },
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.primaryText}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PaywallScreen;

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

  // PLAN CARD
  planCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  planLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  planName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 2,
  },
  planDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  currentPlanRow: {
    marginTop: 10,
  },
  currentPlanText: {
    fontSize: 11,
    marginTop: 2,
  },
  upgradeBadge: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  upgradeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // SECTIONS
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },

  sectionHintTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  sectionHintText: {
    fontSize: 11,
    lineHeight: 16,
  },

  // BOTTOM BAR
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 16,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bottomTextCol: {
    flex: 1,
  },
  bottomTitle: {
    fontSize: 13,
    fontWeight: "600",
  },
  bottomSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  bottomButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  laterBtn: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  laterText: {
    fontSize: 11,
  },
  primaryBtn: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    color: "#020617",
    fontSize: 12,
    fontWeight: "700",
  },
});
