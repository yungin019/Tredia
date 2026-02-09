// src/screens/PaywallScreen.tsx

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import GlowView from "../components/GlowView";
import NeonButton from "../components/NeonButton";

import Purchases, {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";

import {
  type PlanInfo,
  type PlanName,
  fetchUserPlan,
  changeUserPlan,
} from "../services/planClient";

type PaywallRouteParams = {
  plan: PlanInfo;
  currentPlanName: string;
};

const PaywallScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const params = route.params as PaywallRouteParams | undefined;
  const selectedPlan = params?.plan;
  const currentPlanName =
    (params?.currentPlanName || "FREE").toString().toUpperCase();

  const [isProcessing, setIsProcessing] = useState(false);
  const [rcError, setRcError] = useState<string | null>(null);

  if (!selectedPlan) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={{ color: theme.textPrimary, marginBottom: 8 }}>
          No plan selected.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backBtn,
            { borderColor: theme.cardBorder },
          ]}
        >
          <Text style={{ color: theme.accent }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const targetPlanName = selectedPlan.name.toUpperCase() as PlanName;
  const isCurrent =
    targetPlanName === currentPlanName.toUpperCase();
  const isDowngrade =
    targetPlanName === "FREE" &&
    currentPlanName !== "FREE" &&
    !isCurrent;
  const isUpgrade =
    targetPlanName !== "FREE" && !isCurrent;

  const priceLabel =
    selectedPlan.priceMonthly === 0
      ? "Free"
      : `${selectedPlan.priceMonthly.toFixed(0)} ${
          selectedPlan.currency
        } / month`;

  const explainText = isCurrent
    ? "You’re already on this plan. You can keep enjoying your current AI limits."
    : isDowngrade
    ? "You’re about to move back to the FREE plan. You’ll keep access to Tredia, but with reduced AI limits."
    : "This plan unlocks deeper AI context, more messages and a better market radar. The purchase is handled securely by the App Store via RevenueCat.";

  const primaryCtaLabel = isCurrent
    ? "Back to subscription"
    : isDowngrade
    ? "Confirm downgrade to FREE"
    : `Upgrade to ${targetPlanName}`;

  const findPackageForPlan = (
    offerings: PurchasesOfferings,
    planName: PlanName
  ): PurchasesPackage | null => {
    const offering =
      offerings.current || offerings.all["default"] || null;
    if (!offering) return null;

    // TEMP MAPPING – you should align these with your RevenueCat package identifiers
    const desiredId = `${planName.toLowerCase()}_monthly`;

    const exact = offering.availablePackages.find(
      (p) => p.identifier === desiredId
    );
    if (exact) return exact;

    // Fallback: monthly > annual > first available
    if (offering.monthly) return offering.monthly;
    if (offering.annual) return offering.annual;
    return offering.availablePackages[0] ?? null;
  };

  const refreshServerPlan = useCallback(async () => {
    try {
      await fetchUserPlan();
    } catch {
      // Silent – Settings/Profile will refetch later anyway
    }
  }, []);

  const handleDowngradeToFree = useCallback(async () => {
    setIsProcessing(true);
    setRcError(null);
    try {
      // Optional: logOut from RevenueCat when downgrading to FREE
      try {
        await Purchases.logOut();
      } catch {
        // Non-blocking if logOut fails
      }

      await changeUserPlan("FREE");
      await refreshServerPlan();

      Alert.alert(
        "Plan updated",
        "You’re now on the FREE plan. You can always upgrade again later.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      console.log("[Paywall] downgrade error:", err?.message || err);
      setRcError("Failed to update plan on the server.");
      Alert.alert(
        "Error",
        "We couldn’t update your plan. Please try again in a moment."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [navigation, refreshServerPlan]);

  const handlePurchaseWithRevenueCat = useCallback(async () => {
    setIsProcessing(true);
    setRcError(null);
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = findPackageForPlan(offerings, targetPlanName);

      if (!pkg) {
        setRcError("No matching subscription package found.");
        Alert.alert(
          "Unavailable",
          "We couldn’t find a subscription package for this plan. Please try again later."
        );
        return;
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);

      const entitlements = customerInfo.entitlements?.active || {};
      const hasAny =
        Object.keys(entitlements).length > 0;

      if (!hasAny) {
        setRcError(
          "Purchase completed but no active entitlement detected."
        );
        Alert.alert(
          "Check subscription",
          "Your purchase went through, but we couldn’t confirm the entitlement. Try restoring purchases or contact support if it doesn’t show up."
        );
      }

      try {
        await changeUserPlan(targetPlanName);
      } catch (syncErr: any) {
        console.log(
          "[Paywall] backend changeUserPlan error:",
          syncErr?.message || syncErr
        );
        setRcError(
          "Subscription updated on App Store, but server sync failed."
        );
      }

      await refreshServerPlan();

      Alert.alert(
        "Welcome to " + targetPlanName,
        "Your plan has been updated. Enjoy deeper AI context and higher limits.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      console.log("[Paywall] purchase error:", err);

      // RevenueCat cancellation pattern
      const isUserCancelled =
        err?.userCancelled === true ||
        err?.code === "PURCHASE_CANCELLED";

      if (isUserCancelled) {
        setRcError("Purchase cancelled.");
        return;
      }

      setRcError("Purchase failed. Please try again.");
      Alert.alert(
        "Purchase error",
        "We couldn’t complete the purchase. Please try again or contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [navigation, refreshServerPlan, targetPlanName]);

  const handleRestorePurchases = useCallback(async () => {
    setIsProcessing(true);
    setRcError(null);
    try {
      await Purchases.restorePurchases();
      const updated = await fetchUserPlan();

      Alert.alert(
        "Restored",
        `We restored your purchases. Current plan: ${updated.planName}.`,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (err: any) {
      console.log("[Paywall] restore error:", err?.message || err);
      setRcError("Failed to restore purchases.");
      Alert.alert(
        "Restore failed",
        "We couldn’t restore purchases. Please try again later."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [navigation]);

  const handlePrimaryPress = () => {
    if (isCurrent) {
      navigation.goBack();
      return;
    }
    if (isDowngrade) {
      void handleDowngradeToFree();
      return;
    }
    void handlePurchaseWithRevenueCat();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: theme.textPrimary }]}
        >
          {selectedPlan.name} plan
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.textSoft }]}
        >
          Control your subscription via the App Store. Tredia just
          reflects your active plan and AI limits.
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* PLAN CARD */}
        <GlowView radius={22}>
          <View
            style={[
              styles.planCard,
              {
                borderColor: theme.cardBorder,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.planName,
                { color: theme.textPrimary },
              ]}
            >
              {selectedPlan.name}
            </Text>
            <Text
              style={[
                styles.planPrice,
                { color: theme.textPrimary },
              ]}
            >
              {priceLabel}
            </Text>

            {selectedPlan.description && (
              <Text
                style={[
                  styles.planDescription,
                  { color: theme.textSoft },
                ]}
              >
                {selectedPlan.description}
              </Text>
            )}

            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.badge,
                  { borderColor: theme.cardBorder },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: theme.textSoft },
                  ]}
                >
                  AI limit:{" "}
                  {selectedPlan.aiDailyLimit === null
                    ? "Unlimited messages / day"
                    : `${selectedPlan.aiDailyLimit} messages / day`}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { borderColor: theme.cardBorder },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: theme.textSoft },
                  ]}
                >
                  Current: {currentPlanName}
                </Text>
              </View>
            </View>
          </View>
        </GlowView>

        {/* EXPLANATION */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionText,
              { color: theme.textSoft },
            ]}
          >
            {explianOrExplain(explainText)}
          </Text>
        </View>

        {/* PRIMARY CTA */}
        <View style={styles.section}>
          <NeonButton
            label={primaryCtaLabel}
            onPress={handlePrimaryPress}
            glowColor={theme.accent}
            disabled={isProcessing}
          />
          {isProcessing && (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color={theme.accent} />
              <Text
                style={[
                  styles.processingText,
                  { color: theme.textSoft },
                ]}
              >
                Processing…
              </Text>
            </View>
          )}
        </View>

        {/* SECONDARY ACTIONS */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.secondaryBtn,
              { borderColor: theme.cardBorder },
            ]}
            disabled={isProcessing}
            onPress={handleRestorePurchases}
          >
            <Text
              style={[
                styles.secondaryText,
                { color: theme.textSoft },
              ]}
            >
              Restore purchases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.goBack()}
            disabled={isProcessing}
          >
            <Text
              style={[
                styles.linkText,
                { color: theme.textSoft },
              ]}
            >
              Cancel and go back
            </Text>
          </TouchableOpacity>
        </View>

        {rcError && (
          <View style={styles.section}>
            <Text
              style={[
                styles.errorText,
                { color: theme.danger ?? "#ef4444" },
              ]}
            >
              {rcError}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// Small helper to avoid typos if we want to extend later
function explianOrExplain(text: string): string {
  return text;
}

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

  // CENTER FALLBACK
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  // PLAN CARD
  planCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
  },
  planPrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  planDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
  },

  // SECTIONS
  section: {
    marginTop: 10,
  },
  sectionText: {
    fontSize: 12,
    lineHeight: 18,
  },

  // PROCESSING
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  processingText: {
    fontSize: 12,
  },

  // SECONDARY
  secondaryBtn: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 12,
    fontWeight: "500",
  },
  linkBtn: {
    paddingVertical: 4,
    alignItems: "center",
  },
  linkText: {
    fontSize: 12,
    textDecorationLine: "underline",
  },

  // ERROR
  errorText: {
    fontSize: 11,
    marginTop: 4,
  },
});
