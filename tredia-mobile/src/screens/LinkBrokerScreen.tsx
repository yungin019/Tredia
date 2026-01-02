// src/screens/LinkBrokerScreen.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  connectBroker,
  fetchAvailableBrokers,
  getTradeDeeplink,
  openBrokerApp,
  type BrokerPlatform,
} from "../services/brokerLinkService";
import i18n from "../config/i18n";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "LinkBroker">;

type BrokerUiCopy = {
  headline: string;
  description: string;
  bullets: string[];
  deepLink?: string;
  storeLink?: string;
};

const BROKER_UI: Record<string, BrokerUiCopy> = {
  etoro: {
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
  binance: {
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
  avanza: {
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
  trading212: {
    headline: "Simple investing & trading.",
    description:
      "You execute on Trading 212, Tredia helps you plan entries, size risk, and stay consistent.",
    bullets: ["Stocks & ETFs", "Easy mobile execution", "Great for beginners to intermediate"],
    deepLink: "trading212://",
  },
  revolut: {
    headline: "Trading inside your banking app.",
    description:
      "You trade on Revolut, Tredia helps you avoid emotional decisions and track your process.",
    bullets: ["Stocks & crypto", "Fast access", "Good for casual investing"],
    deepLink: "revolut://",
  },
};

function getBrokerCopy(broker: BrokerPlatform): BrokerUiCopy {
  const known = BROKER_UI[broker.slug];
  if (known) return known;
  return {
    headline: `Trade on ${broker.name}.`,
    description:
      "Tredia doesn’t connect to broker accounts yet. This saves your preferred broker and helps you open the right app.",
    bullets: ["Save your preferred broker", "Open the broker quickly", "Log your trades inside Tredia"],
  };
}



const LinkBrokerScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme: any = useTheme();
  const { token } = useAuth();

  const [brokers, setBrokers] = useState<BrokerPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const initialSlug = (route.params as any)?.brokerId as string | undefined;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchAvailableBrokers();
        const enabled = (list ?? []).filter((b) => b.isEnabled !== false);
        if (!mounted) return;
        setBrokers(enabled);

        const defaultSlug =
          (initialSlug && enabled.find((b) => b.slug === initialSlug)?.slug) ||
          enabled[0]?.slug ||
          null;

        setSelectedSlug(defaultSlug);
      } catch (err) {
        console.warn("[LinkBroker] failed to fetch brokers", err);
        if (!mounted) return;
        setBrokers([]);
        setSelectedSlug(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialSlug]);

  const selected = useMemo(() => {
    if (!selectedSlug) return null;
    return brokers.find((b) => b.slug === selectedSlug) ?? null;
  }, [brokers, selectedSlug]);

  const handleOpenBrokerApp = async () => {
    if (!selected) return;

    try {
      setIsOpening(true);

      if (token) {
        try {
          const url = await getTradeDeeplink("TSLA");
          if (url) {
            await Linking.openURL(url);
            return;
          }
        } catch (err: any) {
          if (err?.code === "NO_BROKER_OR_LINK") {
            Alert.alert(i18n.t("broker.selectFirstTitle"), i18n.t("broker.selectFirstDesc"));
            return;
          }
          console.warn("[LinkBroker] deeplink fetch error, falling back", err);
        }
      }

      await openBrokerApp(selected);
    } catch (err) {
      console.warn("[LinkBroker] open error", err);
      Alert.alert(
        i18n.t("broker.openErrorTitle"),
        i18n.t("broker.openErrorDesc")
      );
    } finally {
      setIsOpening(false);
    }
  };

  const handleSaveBroker = async () => {
    if (!selected) return;

    if (!token) {
      Alert.alert(i18n.t("broker.signInTitle"), i18n.t("broker.signInDesc"));
      return;
    }

    try {
      setIsSaving(true);
      setSavedMessage(null);

      await connectBroker(selected.slug);

      setSavedMessage(i18n.t("broker.saved"));
    } catch (err) {
      console.error("[LinkBroker] save error", err);
      Alert.alert(i18n.t("broker.saveErrorTitle"), i18n.t("broker.saveErrorDesc"));
    } finally {
      setIsSaving(false);
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
      <Text style={[styles.kicker, { color: theme.colors.textSoft }]}>{i18n.t("broker.kicker")}</Text>

      <Text style={[styles.title, { color: theme.colors.textPrimary }]}> 
        {i18n.t("broker.title")}
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.textSoft }]}> 
        {i18n.t("broker.subtitle")}
      </Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={[styles.loadingText, { color: theme.colors.textSoft }]}> 
            {i18n.t("broker.loading")}
          </Text>
        </View>
      ) : brokers.length === 0 ? (
        <View style={styles.loadingWrap}>
          <Text style={[styles.loadingText, { color: theme.colors.textSoft }]}> 
            {i18n.t("broker.none")}
          </Text>
        </View>
      ) : (
        brokers.map((broker) => {
          const isSelected = broker.slug === selectedSlug;
          const copy = getBrokerCopy(broker);

          return (
            <TouchableOpacity
              key={broker.slug}
              activeOpacity={0.9}
              onPress={() => setSelectedSlug(broker.slug)}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: isSelected ? theme.colors.accent : theme.colors.cardBorder,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <View style={styles.cardTitleRow}>
                  {broker.logoUrl ? (
                    <Image
                      source={{ uri: broker.logoUrl }}
                      style={styles.brokerLogo}
                      resizeMode="contain"
                    />
                  ) : null}

                  <Text style={[styles.cardName, { color: theme.colors.textPrimary }]}>
                    {broker.name}
                  </Text>
                </View>

                <View
                  style={[
                    styles.selectedPill,
                    {
                      backgroundColor: isSelected ? theme.colors.accent : "transparent",
                      borderColor: theme.colors.accent,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.selectedPillText,
                      { color: isSelected ? theme.colors.background : theme.colors.accent },
                    ]}
                  >
                    {isSelected ? i18n.t("broker.selected") : i18n.t("broker.tapToSelect")}
                  </Text>
                </View>
              </View>

              <Text style={[styles.cardHeadline, { color: theme.colors.textPrimary }]}>
                {copy.headline}
              </Text>

              <Text style={[styles.cardDescription, { color: theme.colors.textSoft }]}>
                {copy.description}
              </Text>

              {copy.bullets.map((b) => (
                <View key={b} style={styles.bulletRow}>
                  <Text style={[styles.bulletDot, { color: theme.colors.accent }]}>•</Text>
                  <Text style={[styles.bulletText, { color: theme.colors.textSoft }]}>
                    {b}
                  </Text>
                </View>
              ))}
            </TouchableOpacity>
          );
        })
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSaveBroker}
          disabled={isSaving || !selected}
          style={[
            styles.primaryButton,
            { backgroundColor: theme.colors.accent, opacity: isSaving || !selected ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}> 
            {isSaving ? i18n.t("broker.saving") : i18n.t("broker.save")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleOpenBrokerApp}
          disabled={isOpening || !selected}
          style={[
            styles.secondaryButton,
            { borderColor: theme.colors.cardBorder, opacity: isOpening || !selected ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}> 
            {isOpening ? i18n.t("broker.opening") : i18n.t("broker.open")}
          </Text>
        </TouchableOpacity>

        {savedMessage ? (
          <Text style={[styles.helperText, { color: theme.colors.accent }]}>{savedMessage}</Text>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSkip}
          style={[styles.secondaryButton, { borderColor: theme.colors.cardBorder }]}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}> 
            {i18n.t("broker.skip")}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.helperText, { color: theme.colors.textSoft }]}> 
          {i18n.t("broker.later")}
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
  loadingWrap: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
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
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  brokerLogo: {
    width: 28,
    height: 28,
    borderRadius: 7,
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
