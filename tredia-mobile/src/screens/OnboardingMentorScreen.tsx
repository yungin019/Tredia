// src/screens/OnboardingMentorScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext";

const ONBOARDING_DONE_KEY = "tredia_onboarding_done_v1";

const STEPS = [
  {
    id: 1,
    label: "Welcome",
    title: "Hey, I’m your AI trading mentor.",
    body: `I’m Tredia, your personal AI guide for the markets. I scan data, news and charts 24/7 so you can focus on decisions — not noise.`,
    highlight: "We’re here to make smart trading simple and accessible.",
  },
  {
    id: 2,
    label: "How it works",
    title: "I read the markets. You stay in control.",
    body: `I’ll show you probabilities, scenarios and risk, but you always decide when to buy or sell. No auto-trading, no hidden actions.`,
    highlight: "Think of me as a co-pilot, not a robot trader.",
  },
  {
    id: 3,
    label: "Broker connect",
    title: "Tredia is not a broker.",
    body: `We don’t hold your money and we don’t execute trades for you. Instead, we connect to your existing broker in read-only mode.`,
    highlight:
      "That means I can analyse your portfolio and history — but I can’t touch your funds.",
  },
  {
    id: 4,
    label: "Subscriptions",
    title: "Choose the mentor level you want.",
    body: `From free demo mode to full AI mentor, you can unlock deeper insights: portfolio analytics, smart alerts, strategy breakdowns and more.`,
    highlight:
      "Higher tiers = more data, more context, more precision — but same mission: help you grow.",
  },
  {
    id: 5,
    label: "Your mission",
    title: "From low income to confident investor.",
    body: `Whether you’re starting from scratch or already experienced, my goal is the same: help you make better, richer decisions over time.`,
    highlight:
      "This isn’t a get-rich-quick scheme — it’s a smart-rich-forever mindset.",
  },
];

const OnboardingMentorScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme: any = useTheme();
  const [stepIndex, setStepIndex] = useState(0);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_DONE_KEY, "true");
    } catch (e) {
      console.warn("[OnboardingMentor] failed to store flag", e);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "HomeTabs" }],
    });
  };

  const handleNext = () => {
    if (isLast) {
      void finishOnboarding();
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigation.goBack();
    } else {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    void finishOnboarding();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.backButton, { borderColor: theme.cardBorder }]}
          onPress={handleBack}
        >
          <Text style={[styles.backText, { color: theme.textSoft }]}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: theme.textSoft }]}>
            Skip tour
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Avatar bubble */}
        <View
          style={[
            styles.aiBubble,
            {
              backgroundColor: theme.surfaceGlass,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.aiAvatar,
              { backgroundColor: theme.accent },
            ]}
          >
            <Text style={styles.aiAvatarText}>AI</Text>
          </View>
          <View style={styles.aiTextBlock}>
            <Text style={[styles.aiName, { color: theme.textPrimary }]}>
              Tredia Mentor
            </Text>
            <Text style={[styles.aiRole, { color: theme.textSoft }]}>
              Your AI market guide
            </Text>
          </View>
        </View>

        {/* Step label */}
        <Text style={[styles.stepLabel, { color: theme.textSoft }]}>
          Step {stepIndex + 1} of {STEPS.length} · {step.label}
        </Text>

        {/* Title */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {step.title}
        </Text>

        {/* Body */}
        <Text style={[styles.body, { color: theme.textSoft }]}>
          {step.body}
        </Text>

        {/* Highlight card */}
        <View
          style={[
            styles.highlightCard,
            {
              backgroundColor: theme.surfaceAlt,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text
            style={[styles.highlightText, { color: theme.textPrimary }]}
          >
            {step.highlight}
          </Text>
        </View>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((_, idx) => {
            const active = idx === stepIndex;
            return (
              <View
                key={idx}
                style={[
                  styles.dot,
                  {
                    backgroundColor: active
                      ? theme.accent
                      : theme.surfaceAlt,
                    opacity: active ? 1 : 0.4,
                  },
                ]}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: theme.accent,
            },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {isLast ? "Start with your AI mentor" : "Continue"}
          </Text>
        </TouchableOpacity>

        {!isLast && (
          <TouchableOpacity style={styles.secondaryLink} onPress={handleSkip}>
            <Text
              style={[styles.secondaryText, { color: theme.textSoft }]}
            >
              I’ll explore on my own
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingMentorScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8, // slightly more breathing room
    paddingBottom: 4,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 18,
    fontWeight: "600",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18, // pushed a bit lower on screen
    paddingBottom: 32,
  },
  aiBubble: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  aiAvatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  aiAvatarText: {
    color: "#0b1020",
    fontWeight: "700",
    fontSize: 14,
  },
  aiTextBlock: {
    marginLeft: 10,
  },
  aiName: {
    fontSize: 15,
    fontWeight: "600",
  },
  aiRole: {
    fontSize: 12,
  },
  stepLabel: {
    marginTop: 24,
    fontSize: 13,
  },
  title: {
    marginTop: 12,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
  },
  body: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 21,
  },
  highlightCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  highlightText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  dotsRow: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginHorizontal: 4,
  },
  bottomBar: {
    paddingHorizontal: 22,
    paddingBottom: 18, // less than before → pushes up a bit
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryLink: {
    marginTop: 12,
  },
  secondaryText: {
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
