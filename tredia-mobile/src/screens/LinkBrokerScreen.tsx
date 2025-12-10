// src/screens/LinkBrokerScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "LinkBroker">;

type BrokerId = "etoro" | "binance" | "avanza";

interface BrokerConfig {
  id: BrokerId;
  name: string;
  headline: string;
  description: string;
  bullets: string[];
  deepLink: string;   // app scheme
  storeLink: string;  // App Store / Play Store URL
}

const BROKERS: BrokerConfig[] = [
  {
    id: "etoro",
    name: "eToro",
    headline: "Social & multi-asset trading.",
    description:
      "You trade on eToro, Tredia sits on top and coaches your real decisions.",
    bullets: [
      "Stocks, crypto, indices & more",
      "Copy trading & social sentiment",
      "Great for active multi-asset traders",
    ],
    deepLink: "etoro://home",
    storeLink:
      "https://apps.apple.com/app/etoro-invest-in-stocks-crypto/id674984916",
  },
  {
    id: "binance",
    name: "Binance",
    headline: "Crypto-first exchange for active traders.",
    description:
      "You execute on Binance, Tredia helps with structure, risk and discipline.",
    bullets: [
      "Spot, futures, options",
      "Deep liquidity for majors",
      "Best for crypto-focused traders",
    ],
    deepLink: "binance://home",
    storeLink:
      "https://apps.apple.com/app/binance-buy-bitcoin-securely/id1436799971",
  },
  {
    id: "avanza",
    name: "Avanza",
    headline: "Nordic broker for stocks & funds.",
    description:
      "You trade on Avanza, Tredia gives you AI context around your Swedish and global holdings.",
    bullets: [
      "Nordic & global equities",
      "Long-term portfolios and funds",
      "Great for investors, not just traders",
    ],
    deepLink: "avanza://",
    storeLink: "https://apps.apple.com/app/avanza-bank/id303598465",
  },
];

const LinkBrokerScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme: any = useTheme();

  // If the user came with params, pre-select the broker
  const initialId =
    (route.params?.brokerId as BrokerId | undefined) ?? "etoro";
  const [selectedId, setSelectedId] = useState<BrokerId>(initialId);
  const [isOpening, setIsOpening] = useState(false);

  const selected = BROKERS.find((b) => b.id === selectedId) ?? BROKERS[0];

  const handleContinue = async () => {
    try {
      setIsOpening(true);

      const canOpen = await Linking.canOpenURL(selected.deepLink);

      if (canOpen) {
        await Linking.openURL(selected.deepLink);
      } else {
        await Linking.openURL(selected.storeLink);
      }

      // After the redirect, we just drop the user in the app
      navigation.replace("HomeTabs");
    } catch (err) {
      console.warn("[LinkBroker] open error", err);
      Alert.alert(
        "Could not open broker",
        "We had an issue opening the broker app. You can still continue into Tredia – add or change your broker later from Settings.",
      );
      navigation.replace("HomeTabs");
    } finally {
      setIsOpening(false);
    }
  };

  const handleSkip = () => {
    navigation.replace("HomeTabs");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.kicker, { color: theme.colors.textSoft }]}>
        CONNECT YOUR BROKER
      </Text>

      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
        Where do you usually trade?
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.textSoft }]}>
        Tredia sits on top of your existing broker. Pick the platforms you
        already use so the AI can guide you on real moves, not just theory.
      </Text>

      {BROKERS.map((broker) => {
        const isSelected = broker.id === selectedId;

        return (
          <TouchableOpacity
            key={broker.id}
            activeOpacity={0.9}
            onPress={() => setSelectedId(broker.id)}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: isSelected
                  ? theme.colors.accent
                  : theme.colors.cardBorder,
              },
            ]}
          >
            <View style={styles.cardHeaderRow}>
              <Text
                style={[
                  styles.cardName,
                  { color: theme.colors.textPrimary },
                ]}
              >
                {broker.name}
              </Text>

              <View
                style={[
                  styles.selectedPill,
                  {
                    backgroundColor: isSelected
                      ? theme.colors.accent
                      : "transparent",
                    borderColor: theme.colors.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.selectedPillText,
                    {
                      color: isSelected
                        ? theme.colors.background
                        : theme.colors.accent,
                    },
                  ]}
                >
                  {isSelected ? "Selected" : "Tap to select"}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.cardHeadline,
                { color: theme.colors.textPrimary },
              ]}
            >
              {broker.headline}
            </Text>

            <Text
              style={[
                styles.cardDescription,
                { color: theme.colors.textSoft },
              ]}
            >
              {broker.description}
            </Text>

            {broker.bullets.map((b) => (
              <View key={b} style={styles.bulletRow}>
                <Text
                  style={[styles.bulletDot, { color: theme.colors.accent }]}
                >
                  •
                </Text>
                <Text
                  style={[
                    styles.bulletText,
                    { color: theme.colors.textSoft },
                  ]}
                >
                  {b}
                </Text>
              </View>
            ))}
          </TouchableOpacity>
        );
      })}

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleContinue}
          disabled={isOpening}
          style={[
            styles.primaryButton,
            {
              backgroundColor: theme.colors.accent,
              opacity: isOpening ? 0.6 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { color: theme.colors.background },
            ]}
          >
            {isOpening
              ? "Opening broker…"
              : "Continue with selected broker"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSkip}
          style={[
            styles.secondaryButton,
            { borderColor: theme.colors.cardBorder },
          ]}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              { color: theme.colors.textPrimary },
            ]}
          >
            Skip for now – go to the app
          </Text>
        </TouchableOpacity>

        <Text
          style={[styles.helperText, { color: theme.colors.textSoft }]}
        >
          You can add or change brokers later from Settings.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "700",
  },
  selectedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  selectedPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  cardHeadline: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
  },
  bulletDot: {
    fontSize: 13,
    marginRight: 4,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    marginTop: 12,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  helperText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});

export default LinkBrokerScreen;
