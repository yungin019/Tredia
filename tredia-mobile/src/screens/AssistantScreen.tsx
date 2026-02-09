// src/screens/AssistantScreen.tsx

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenWrapper from "../components/ScreenWrapper";
import { useTheme } from "../context/ThemeContext";
import ChatBubble, { ChatRole } from "../components/ChatBubble";
import {
  chatWithAssistant,
  api,
  type AiMessage as AiClientMessage,
} from "../services/aiClient";
import { useAuth } from "../context/AuthContext";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type PlanName = "FREE" | "PRO" | "ELITE" | string;

type AssistantScreenProps = {
  navigation: any;
  route?: {
    params?: {
      initialQuestion?: string;
      presetPrompt?: string;
    };
  };
};

const AssistantScreen: React.FC<AssistantScreenProps> = ({ route }) => {
  const theme: any = useTheme();
  const { user }: any = useAuth();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Plan / limits state
  const [planName, setPlanName] = useState<PlanName | null>(null);
  const [dailyLimit, setDailyLimit] = useState<number | null>(null);
  const [remainingToday, setRemainingToday] =
    useState<number | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);
  const initialQuestion = route?.params?.initialQuestion;
  const presetPrompt = route?.params?.presetPrompt;

  // Prefill input if we navigated here with a question
  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
    } else if (presetPrompt) {
      setInput(presetPrompt);
    }
  }, [initialQuestion, presetPrompt]);

  // Fetch plan + AI limits on mount
  useEffect(() => {
    const loadPlan = async () => {
      try {
        const res = await api.get("/user/plan");
        const data = res.data || {};

        const backendPlan = data.planName || data.name || "FREE";
        setPlanName(backendPlan);

        setDailyLimit(
          typeof data.aiDailyLimit === "number"
            ? data.aiDailyLimit
            : typeof data.dailyLimit === "number"
            ? data.dailyLimit
            : null
        );

        if (typeof data.remainingToday === "number") {
          setRemainingToday(data.remainingToday);
        } else if (
          typeof data.aiDailyLimit === "number" &&
          typeof data.usedToday === "number"
        ) {
          setRemainingToday(
            Math.max(0, data.aiDailyLimit - data.usedToday)
          );
        } else {
          setRemainingToday(null);
        }
      } catch (err) {
        console.warn(
          "[AssistantScreen] Failed to load user plan",
          err
        );
      }
    };

    void loadPlan();
  }, []);

  // Autoscroll on new messages / loading
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, isSending]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    if (!user || !user.id) {
      setLimitError(
        "You need to be signed in to use Tredia AI. Please log in first."
      );
      return;
    }

    setLimitError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    // Snapshot previous messages to build history safely
    const prevMessages = [...messages];

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      // Build history from previous messages (WITHOUT the new userMsg)
      const history: AiClientMessage[] = prevMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

      // Add the new user question at the end
      const payloadMessages: AiClientMessage[] = [
        ...history,
        { role: "user", content: trimmed },
      ];

      const res = await chatWithAssistant(user.id, payloadMessages);

      // Update plan / quota from response if present
      if (res.planName) {
        setPlanName(res.planName);
      }
      if (
        typeof res.dailyLimit === "number" ||
        res.dailyLimit === null
      ) {
        setDailyLimit(res.dailyLimit);
      }
      if (
        typeof res.remainingToday === "number" ||
        res.remainingToday === null
      ) {
        setRemainingToday(res.remainingToday);
      }

      const aiMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.reply || "No response from Tredia AI.",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(
        "[AssistantScreen] chat error:",
        err?.message || err
      );

      const status = err?.response?.status;
      const data = err?.response?.data || {};

      // If backend enforced the AI limit (403)
      if (status === 403) {
        const msg =
          data.error ||
          "Daily AI limit reached for your plan. You can upgrade to unlock more messages.";
        setLimitError(msg);

        // Update plan & remaining from backend payload if we got it
        if (data.planName) {
          setPlanName(data.planName);
        }
        if (
          typeof data.dailyLimit === "number" ||
          data.dailyLimit === null
        ) {
          setDailyLimit(data.dailyLimit);
        }
        if (
          typeof data.remainingToday === "number" ||
          data.remainingToday === null
        ) {
          setRemainingToday(data.remainingToday);
        }

        const errorMsg: ChatMessage = {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: msg,
        };

        setMessages((prev) => [...prev, errorMsg]);
      } else {
        const errorText =
          data.error ||
          "There was an issue reaching Tredia AI. Please try again.";

        const errorMsg: ChatMessage = {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: errorText,
        };

        setMessages((prev) => [...prev, errorMsg]);
      }
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, messages, user]);

  // --- Derived display values for plan / quota ---
  const displayPlan = (planName || "FREE").toString().toUpperCase();

  let quotaLabel = "AI messages";
  if (dailyLimit === null) {
    quotaLabel = "Unlimited AI messages today";
  } else if (typeof remainingToday === "number") {
    quotaLabel = `${remainingToday}/${dailyLimit} messages left today`;
  } else {
    quotaLabel = `Daily limit: ${dailyLimit} messages`;
  }

  return (
    <ScreenWrapper>
      <SafeAreaView
        style={[
          styles.safe,
          { backgroundColor: theme.background },
        ]}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <View
            style={[
              styles.container,
              { backgroundColor: theme.background },
            ]}
          >
            {/* HEADER */}
            <View style={styles.headerContainer}>
              <View style={styles.headerTopRow}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.textPrimary },
                  ]}
                >
                  Tredia AI
                </Text>

                <View
                  style={[
                    styles.planPill,
                    {
                      borderColor: theme.accent,
                      backgroundColor: theme.surfaceAlt,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.planPillText,
                      { color: theme.accent },
                    ]}
                  >
                    Plan: {displayPlan}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.subtitle,
                  { color: theme.textSoft },
                ]}
              >
                Ask about BTC, stocks, macro or macro-risk. Tredia’s
                multi-layered AI mentor turns global news, charts and
                sentiment into calm, realistic analysis — never hype.
              </Text>

              <View
                style={[
                  styles.infoBanner,
                  {
                    backgroundColor: theme.surfaceAlt,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.textSoft },
                  ]}
                >
                  {quotaLabel}
                </Text>
                <Text
                  style={[
                    styles.infoTextSmall,
                    { color: theme.textSoft },
                  ]}
                >
                  Limits are enforced on the server by your plan
                  (Free / Pro / Elite). You can chat safely without
                  worrying about extra charges.
                </Text>
              </View>

              {limitError && (
                <Text
                  style={[
                    styles.limitErrorText,
                    { color: theme.danger || "#f97373" },
                  ]}
                >
                  {limitError}
                </Text>
              )}
            </View>

            {/* CHAT AREA */}
            <View
              style={[
                styles.chatContainer,
                {
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <ScrollView
                ref={scrollRef}
                style={styles.messages}
                contentContainerStyle={styles.messagesContent}
                keyboardShouldPersistTaps="handled"
              >
                {messages.length === 0 && !isSending && (
                  <View style={styles.emptyState}>
                    <Text
                      style={[
                        styles.emptyTitle,
                        { color: theme.textPrimary },
                      ]}
                    >
                      Start a conversation
                    </Text>
                    <Text
                      style={[
                        styles.emptyText,
                        { color: theme.textSoft },
                      ]}
                    >
                      Try something like:{"\n"}
                      • “What&apos;s your view on BTC this week?”{"\n"}
                      • “How risky is holding TSLA into earnings?”{"\n"}
                      • “Scan for the next big jumps in energy or tech this month.”
                    </Text>
                  </View>
                )}

                {messages.map((msg) => (
                  <ChatBubble
                    key={msg.id}
                    role={msg.role}
                    text={msg.content}
                  />
                ))}

                {isSending && (
                  <View style={styles.typingRow}>
                    <ActivityIndicator
                      size="small"
                      color={theme.accent}
                    />
                    <Text
                      style={[
                        styles.typingText,
                        { color: theme.textSoft },
                      ]}
                    >
                      Analyzing your question…
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* INPUT ROW */}
            <View
              style={[
                styles.inputRow,
                {
                  borderTopColor: theme.cardBorder,
                  backgroundColor: theme.surfaceAlt,
                },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.textPrimary,
                    backgroundColor: theme.surface,
                  },
                ]}
                value={input}
                onChangeText={setInput}
                placeholder="Ask about BTC, macro, risk or a position…"
                placeholderTextColor={theme.textSoft}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: theme.accent,
                    opacity:
                      !input.trim() || isSending ? 0.4 : 1,
                  },
                ]}
                onPress={handleSend}
                disabled={!input.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#020617" />
                ) : (
                  <Text style={styles.sendLabel}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default AssistantScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  // HEADER
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  planPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  planPillText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  infoBanner: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoTextSmall: {
    fontSize: 11,
    opacity: 0.85,
  },
  limitErrorText: {
    marginTop: 6,
    fontSize: 12,
  },

  // CHAT
  chatContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 4,
  },
  emptyState: {
    paddingVertical: 32,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  typingText: {
    fontSize: 13,
  },

  // INPUT
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 10 : 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendLabel: {
    color: "#020617",
    fontWeight: "600",
    fontSize: 14,
  },
});
