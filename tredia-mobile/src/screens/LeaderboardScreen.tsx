// src/screens/LeaderboardScreen.tsx

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

export interface LeaderboardEntry {
  id: string;
  userDisplayName?: string | null;
  handle?: string | null;
  avatarColor?: string | null;
  country?: string | null;
  pnlTotal?: number | null;
  pnlPct?: number | null;
  tradesCount?: number | null;
  rank?: number | null;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
}

const LeaderboardScreen: React.FC = () => {
  const theme: any = useTheme();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);

      // ✅ FIXED: no "/api" here
      const res = await api.get<LeaderboardResponse>(
        "/community/leaderboard",
        {
          params: {
            limit: 50,
          },
        }
      );

      const data = res.data;
      const list =
        (data as any)?.entries ||
        (data as any)?.leaderboard ||
        [];
      setEntries(Array.isArray(list) ? list : []);
    } catch (err: any) {
      console.log("[Leaderboard] API error:", err?.message || err);
      setError("Leaderboard is temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLeaderboard(false);
  }, [loadLeaderboard]);

  const onRefresh = () => {
    void loadLeaderboard(true);
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
          Leaderboard
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Paper-trading performance across the Tredia community.
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

        {entries.length === 0 && !error && (
          <Text style={[styles.empty, { color: theme.textSoft }]}>
            No leaderboard data yet. Once users start trading with paper
            accounts, you’ll see top performers here.
          </Text>
        )}

        {entries.map((entry, index) => {
          const rank =
            typeof entry.rank === "number"
              ? entry.rank
              : index + 1;
          const name =
            entry.userDisplayName ||
            entry.handle ||
            `Trader #${rank}`;
          const pnlTotal = entry.pnlTotal ?? 0;
          const pnlPct = entry.pnlPct ?? 0;
          const trades = entry.tradesCount ?? 0;

          const pnlColor =
            pnlTotal > 0
              ? theme.success ?? theme.accent
              : pnlTotal < 0
              ? theme.danger ?? theme.accent
              : theme.textSoft;

          const avatarColor =
            entry.avatarColor || theme.accent || "#38bdf8";

          return (
            <View
              key={entry.id || `row-${index}`}
              style={[
                styles.row,
                {
                  borderColor: theme.cardBorder,
                  backgroundColor: theme.surface,
                },
              ]}
            >
              <View style={styles.rankCol}>
                <Text
                  style={[
                    styles.rankText,
                    { color: theme.textPrimary },
                  ]}
                >
                  {rank}
                </Text>
              </View>

              <View style={styles.userCol}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: avatarColor },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.nameText,
                      { color: theme.textPrimary },
                    ]}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                  <Text
                    style={[
                      styles.metaText,
                      { color: theme.textSoft },
                    ]}
                    numberOfLines={1}
                  >
                    {entry.country || "Global"} · {trades} trade
                    {trades === 1 ? "" : "s"}
                  </Text>
                </View>
              </View>

              <View style={styles.pnlCol}>
                <Text
                  style={[
                    styles.pnlText,
                    { color: pnlColor },
                  ]}
                >
                  {pnlTotal >= 0 ? "+" : ""}
                  {pnlTotal.toFixed(2)}
                </Text>
                <Text
                  style={[
                    styles.pnlPctText,
                    { color: pnlColor },
                  ]}
                >
                  {pnlPct >= 0 ? "+" : ""}
                  {pnlPct.toFixed(2)}%
                </Text>
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

export default LeaderboardScreen;

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
    paddingTop: 16,
    paddingBottom: 8,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  rankCol: {
    width: 28,
    alignItems: "center",
  },
  rankText: {
    fontSize: 14,
    fontWeight: "700",
  },
  userCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#020617",
    fontWeight: "700",
    fontSize: 14,
  },
  nameText: {
    fontSize: 13,
    fontWeight: "600",
  },
  metaText: {
    fontSize: 11,
    marginTop: 1,
  },
  pnlCol: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  pnlText: {
    fontSize: 13,
    fontWeight: "700",
  },
  pnlPctText: {
    fontSize: 11,
    marginTop: 2,
  },
});
