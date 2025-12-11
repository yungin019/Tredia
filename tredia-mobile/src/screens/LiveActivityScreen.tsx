// src/screens/LiveActivityScreen.tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";
import type { RootStackParamList } from "../navigation/RootNavigator";

export interface LiveActivityItem {
  id: string;
  symbol?: string | null;
  title: string;
  body?: string | null;
  category?: string | null;
  impactLabel?: string | null;
  heat?: number | null;
  sentimentLabel?: "bullish" | "bearish" | "neutral" | null;
  createdAt?: string | null;
}

interface LiveActivityResponse {
  items: LiveActivityItem[];
}

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LiveActivityScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<Nav>();

  const [items, setItems] = useState<LiveActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadLive = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      const res = await api.get<LiveActivityResponse>("/community/live", {
        params: {
          limit: 30,
        },
      });

      const data = res.data;
      const list = (data as any)?.items || (data as any)?.live || [];
      setItems(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.log("[LiveActivity] API error:", err?.message || err);
      setError("Live activity is temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLive(false);
  }, [loadLive]);

  const onRefresh = () => {
    void loadLive(true);
  };

  const getSentimentColor = (label: LiveActivityItem["sentimentLabel"]) => {
    if (!label) return "transparent";
    if (label === "bullish") return theme.success ?? theme.accent;
    if (label === "bearish") return theme.danger ?? theme.accent;
    return theme.accent;
  };

  if (loading && !refreshing) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Live activity
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          What traders & AI are reacting to in real time.
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
        {error && (
          <Text style={[styles.errorText, { color: theme.textSoft }]}>
            {error}
          </Text>
        )}

        {items.length === 0 && !error && (
          <Text style={[styles.empty, { color: theme.textSoft }]}>
            No live events yet. Once your community & AI feed are wired in,
            this screen will show real trades, news shocks, and sentiment
            spikes.
          </Text>
        )}

        {items.map((item) => {
          const heatPct =
            typeof item.heat === "number"
              ? Math.round(item.heat * 100)
              : null;
          const sentimentColor = getSentimentColor(item.sentimentLabel);

          const created =
            item.createdAt != null
              ? new Date(item.createdAt)
              : null;
          const timeLabel = created
            ? created.toLocaleTimeString()
            : "";

          const safeSymbol =
            item.symbol && item.symbol.trim().length > 0
              ? item.symbol.trim().toUpperCase()
              : null;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                {
                  borderColor: theme.cardBorder,
                  backgroundColor: theme.surface,
                },
              ]}
              onPress={() => {
                if (safeSymbol) {
                  navigation.navigate("AssetDetail", {
                    symbol: safeSymbol,
                  });
                }
              }}
            >
              <View style={styles.cardHeaderRow}>
                <View style={{ flex: 1 }}>
                  {safeSymbol && (
                    <Text
                      style={[
                        styles.symbol,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {safeSymbol}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.titleText,
                      { color: theme.textPrimary },
                    ]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                </View>

                {item.sentimentLabel && (
                  <View
                    style={[
                      styles.sentimentPill,
                      { borderColor: sentimentColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sentimentText,
                        { color: sentimentColor },
                      ]}
                    >
                      {item.sentimentLabel.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {item.body && (
                <Text
                  style={[
                    styles.bodyText,
                    { color: theme.textSoft },
                  ]}
                  numberOfLines={3}
                >
                  {item.body}
                </Text>
              )}

              <View style={styles.metaRow}>
                {item.category && (
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.textSoft },
                    ]}
                  >
                    {item.category}
                  </Text>
                )}
                {heatPct != null && (
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.textSoft },
                    ]}
                  >
                    Heat {heatPct}/100
                  </Text>
                )}
                {timeLabel && (
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.textSoft },
                    ]}
                  >
                    {timeLabel}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default LiveActivityScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,      // ↓ was 16
    paddingBottom: 4,   // ↓ was 8
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  empty: {
    fontSize: 12,
    marginTop: 8,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 10,
  },
  symbol: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bodyText: {
    fontSize: 12,
    marginTop: 4,
  },
  sentimentPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  sentimentText: {
    fontSize: 11,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  metaText: {
    fontSize: 11,
  },
});
