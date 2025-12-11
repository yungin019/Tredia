// src/screens/WelcomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useTheme } from "../context/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme: any = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            // flex so we can space content and keep buttons visible
            backgroundColor: theme.colors.background,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* TOP BRAND */}
          <View style={styles.headerRow}>
            <Text style={[styles.logo, { color: theme.colors.accent }]}>
              TREDIA
            </Text>

            <View
              style={[
                styles.badge,
                {
                  borderColor: theme.colors.cardBorder,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: theme.colors.accent },
                ]}
              />
              <Text
                style={[
                  styles.badgeText,
                  { color: theme.colors.textSoft },
                ]}
              >
                AI market radar • Live
              </Text>
            </View>
          </View>

          {/* HERO CARD */}
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.heroTitle,
                { color: theme.colors.textPrimary },
              ]}
            >
              Your AI market brain, always on.
            </Text>

            <Text
              style={[
                styles.heroSubtitle,
                { color: theme.colors.textSoft },
              ]}
            >
              Tredia combines multiple AIs — one for news, one for markets,
              one for your profile, and one that explains everything in plain
              language.
            </Text>

            <View style={styles.statsRow}>
              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSoft },
                  ]}
                >
                  S&amp;P 500 (example)
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  +0.8%
                </Text>
                <Text
                  style={[
                    styles.statChip,
                    { color: theme.colors.accent },
                  ]}
                >
                  Mild uptrend
                </Text>
              </View>

              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSoft },
                  ]}
                >
                  BTC / USDT (example)
                </Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  +2.3%
                </Text>
                <Text
                  style={[
                    styles.statChip,
                    { color: theme.colors.accent },
                  ]}
                >
                  High momentum
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 11,
                marginBottom: 10,
                color: theme.colors.textSoft,
              }}
            >
              Real market data will appear here once you&apos;re signed in.
            </Text>

            <View
              style={[
                styles.aiPill,
                {
                  borderColor: theme.colors.cardBorder,
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              <Text
                style={[
                  styles.aiPillLabel,
                  { color: theme.colors.textSoft },
                ]}
              >
                Example AI insight:
              </Text>
              <Text
                style={[
                  styles.aiPillText,
                  { color: theme.colors.textPrimary },
                ]}
              >
                “Global markets show a risk-on shift. AI predicts increased
                volatility in tech and crypto sectors over the next 12 hours.”
              </Text>
            </View>
          </View>

          {/* SECTION TITLE */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.textPrimary },
              ]}
            >
              What Tredia helps you with
            </Text>

            <View style={styles.bulletList}>
              <Text
                style={[
                  styles.bullet,
                  { color: theme.colors.textSoft },
                ]}
              >
                • Get clear AI explanations of what&apos;s moving and why — in
                human language.
              </Text>
              <Text
                style={[
                  styles.bullet,
                  { color: theme.colors.textSoft },
                ]}
              >
                • Spot global trends and &quot;next big jump&quot;
                probabilities, not just prices.
              </Text>
              <Text
                style={[
                  styles.bullet,
                  { color: theme.colors.textSoft },
                ]}
              >
                • Start with paper trading and community before moving to live
                capital.
              </Text>
            </View>
          </View>
        </View>

        {/* CTA BUTTONS – pinned towards bottom */}
        <View style={styles.buttonsBlock}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: theme.colors.accent },
            ]}
            onPress={() => navigation.navigate("SignIn")}
          >
            <Text style={styles.primaryButtonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { borderColor: theme.colors.cardBorder },
            ]}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: theme.colors.textPrimary },
              ]}
            >
              Create an account
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.footerHint,
              { color: theme.colors.textSoft },
            ]}
          >
            Start with paper trading and let Super AI guide your next move.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,      // was 60
    paddingBottom: 24,   // was 40
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  badgeText: { fontSize: 11 },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    columnGap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  statChip: {
    fontSize: 11,
  },
  aiPill: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
  },
  aiPillLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  aiPillText: {
    fontSize: 13,
    lineHeight: 19,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  bulletList: { rowGap: 4 },
  bullet: {
    fontSize: 13,
    lineHeight: 19,
  },
  buttonsBlock: { marginTop: 8 },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  footerHint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});
