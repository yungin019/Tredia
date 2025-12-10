// src/screens/OnboardingScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme: any = useTheme();
  const styles = makeStyles(theme);

  const handleContinue = () => {
    // New users → after onboarding go to HomeTabs
    navigation.reset({
      index: 0,
      routes: [{ name: "HomeTabs" }],
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP BLOCK: title + cards */}
        <View style={styles.topBlock}>
          {/* TITLE */}
          <Text style={styles.title}>Welcome to Tredia</Text>
          <Text style={styles.subtitle}>
            Let&apos;s show you how your AI mentor will guide your trading
            decisions.
          </Text>

          {/* CARD 1 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🤖 Your AI Trading Mentor</Text>
            <Text style={styles.cardText}>
              Tredia analyses markets 24/7 using news, sentiment, volatility
              data and smart pattern detection. You get clear insights — no
              noise.
            </Text>
          </View>

          {/* CARD 2 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Real-time Market Signals</Text>
            <Text style={styles.cardText}>
              Receive probability-based signals for stocks, crypto and indices.
              Know when the market is trending, reversing or ranging.
            </Text>
          </View>

          {/* CARD 3 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Practice With Zero Risk</Text>
            <Text style={styles.cardText}>
              Before risking real money, use paper trading to practice
              execution, discipline and risk management.
            </Text>
          </View>

          {/* CARD 4 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💎 Subscription Options</Text>
            <Text style={styles.cardText}>
              • Free plan: basic access{"\n"}
              • Pro: full signals + deeper insights{"\n"}
              • Elite: unlimited AI, sentiment radar &amp; advanced coaching
            </Text>
          </View>
        </View>

        {/* CTA BLOCK pinned lower */}
        <View style={styles.bottomBlock}>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue to Tredia</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Tredia helps you interpret markets — you stay in control of your
            decisions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 24,
      paddingBottom: 24,
      flexGrow: 1,
      justifyContent: "space-between", // top block + bottom block
    },
    topBlock: {
      flexShrink: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.textSoft,
      marginBottom: 24,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.cardBorder,
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    cardText: {
      fontSize: 13,
      lineHeight: 20,
      color: theme.colors.textSoft,
    },
    bottomBlock: {
      marginTop: 8,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 4,
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: 15,
      fontWeight: "600",
    },
    footerText: {
      fontSize: 12,
      textAlign: "center",
      marginTop: 14,
      color: theme.colors.textSoft,
      lineHeight: 18,
    },
  });

export default OnboardingScreen;
