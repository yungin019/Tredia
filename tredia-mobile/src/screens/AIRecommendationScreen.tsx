// src/screens/AIRecommendationScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

type Props = {
  navigation: any;
};

type BrokerPlatform = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  description?: string;
};

const BROKER_PLATFORMS: BrokerPlatform[] = [
  {
    id: "etoro",
    name: "eToro",
    slug: "etoro",
    websiteUrl: "https://www.etoro.com",
    description: "Multi-asset + social trading for stocks, crypto & ETFs.",
  },
  {
    id: "binance",
    name: "Binance",
    slug: "binance",
    websiteUrl: "https://www.binance.com",
    description: "High-liquidity crypto exchange for active traders.",
  },
  {
    id: "avanza",
    name: "Avanza",
    slug: "avanza",
    websiteUrl: "https://www.avanza.se",
    description: "Nordic broker for long-term investors in stocks & funds.",
  },
];

const AIRecommendationScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const handleContinueWithBroker = async () => {
    if (!selectedBrokerId) return;

    const broker = BROKER_PLATFORMS.find((b) => b.id === selectedBrokerId);
    if (!broker) return;

    try {
      // Open the REAL broker website (no mock, no deep link fake)
      await Linking.openURL(broker.websiteUrl);
    } catch (err) {
      console.log("Failed to open broker URL:", err);
    }

    // Then drop user into the main app
    navigation.navigate("HomeTabs");
  };

  const handleSkipForNow = () => {
    navigation.navigate("HomeTabs");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.label, { color: theme.textSoft }]}>
        Step 3 • Connect your broker
      </Text>

      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Where do you usually trade?
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSoft }]}>
        Tredia sits on top of the broker you already use. Choose the platform
        where you execute most of your trades so the AI can coach you on real
        decisions, not just theory.
      </Text>

      <View style={styles.cardGroup}>
        {BROKER_PLATFORMS.map((broker) => {
          const active = broker.id === selectedBrokerId;

          return (
            <TouchableOpacity
              key={broker.id}
              style={[
                styles.brokerCard,
                {
                  backgroundColor: theme.card,
                  borderColor: active ? theme.accent : theme.cardBorder,
                },
              ]}
              onPress={() => setSelectedBrokerId(broker.id)}
            >
              <View style={styles.brokerHeader}>
                <Text
                  style={[
                    styles.brokerName,
                    { color: theme.textPrimary },
                  ]}
                >
                  {broker.name}
                </Text>

                {active && (
                  <View
                    style={[
                      styles.selectedPill,
                      { backgroundColor: theme.accent },
                    ]}
                  >
                    <Text style={styles.selectedPillText}>Selected</Text>
                  </View>
                )}
              </View>

              {broker.description && (
                <Text
                  style={[
                    styles.brokerDescription,
                    { color: theme.textSoft },
                  ]}
                >
                  {broker.description}
                </Text>
              )}

              <Text
                style={[
                  styles.brokerHint,
                  { color: theme.textSoft },
                ]}
              >
                You&apos;ll trade on {broker.name}. Tredia tracks the market,
                clarifies risk, and helps you think before you click buy or
                sell.
              </Text>

              <Text
                style={[
                  styles.brokerUrl,
                  { color: theme.accent },
                ]}
              >
                {broker.websiteUrl.replace("https://", "")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor: selectedBrokerId
              ? theme.accent
              : theme.surfaceAlt,
            opacity: selectedBrokerId ? 1 : 0.5,
          },
        ]}
        disabled={!selectedBrokerId}
        onPress={handleContinueWithBroker}
      >
        <Text style={styles.primaryButtonText}>
          Continue with selected broker
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryButton,
          { borderColor: theme.cardBorder },
        ]}
        onPress={handleSkipForNow}
      >
        <Text
          style={[
            styles.secondaryButtonText,
            { color: theme.textSoft },
          ]}
        >
          Skip for now – go to the app
        </Text>
      </TouchableOpacity>

      <Text style={[styles.footerNote, { color: theme.textSoft }]}>
        You can add or change your broker later from Settings. Tredia never
        holds your funds or executes trades directly.
      </Text>
    </ScrollView>
  );
};

export default AIRecommendationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  cardGroup: {
    marginBottom: 24,
  },
  brokerCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  brokerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  brokerName: {
    fontSize: 16,
    fontWeight: "700",
  },
  selectedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
  },
  brokerDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  brokerHint: {
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 6,
  },
  brokerUrl: {
    fontSize: 12,
    fontWeight: "600",
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footerNote: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    opacity: 0.9,
  },
});
