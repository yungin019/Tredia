// src/screens/CommunityFeedScreen.tsx
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

type CommunityPost = {
  id: string;
  user: string;
  handle: string;
  title: string;
  body: string;
  timeAgo: string;
  likes: number;
  comments: number;
};

const CommunityFeedScreen: React.FC = () => {
  const theme: any = useTheme();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/community/posts");
      const data = Array.isArray(res.data) ? res.data : [];

      setPosts(
        data.map((item: any, index: number): CommunityPost => ({
          id: String(item.id ?? index),
          user: item.user ?? "Trader",
          handle: item.handle ?? "@trader",
          title: item.title ?? "",
          body: item.body ?? "",
          timeAgo: item.timeAgo ?? "recently",
          likes: typeof item.likes === "number" ? item.likes : 0,
          comments: typeof item.comments === "number" ? item.comments : 0,
        }))
      );
    } catch (err) {
      console.log("[CommunityFeed] API error:", err);
      setError("Community feed is not available right now.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: theme.textSoft }]}>
          COMMUNITY
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Feed
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          Real posts only. No placeholder trades or fake accounts.
        </Text>

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.accent}
            style={{ marginTop: 24 }}
          />
        )}

        {!loading && error && (
          <Text style={[styles.errorText, { color: theme.textSoft }]}>
            {error}
          </Text>
        )}

        {!loading && !error && posts.length === 0 && (
          <Text style={[styles.emptyText, { color: theme.textSoft }]}>
            No community posts yet. Once traders start sharing ideas, your feed
            will update live from the server.
          </Text>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <View
              key={post.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={styles.headerRow}>
                <Text
                  style={[
                    styles.userName,
                    { color: theme.textPrimary },
                  ]}
                >
                  {post.user}
                </Text>
                <Text
                  style={[
                    styles.timeAgo,
                    { color: theme.textSoft },
                  ]}
                >
                  {post.timeAgo}
                </Text>
              </View>

              <Text
                style={[
                  styles.handleText,
                  { color: theme.textSoft },
                ]}
              >
                {post.handle}
              </Text>

              {post.title ? (
                <Text
                  style={[
                    styles.postTitle,
                    { color: theme.textPrimary },
                  ]}
                >
                  {post.title}
                </Text>
              ) : null}

              {post.body ? (
                <Text
                  style={[
                    styles.postBody,
                    { color: theme.textSoft },
                  ]}
                >
                  {post.body}
                </Text>
              ) : null}

              <View style={styles.metaRow}>
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.textSoft },
                  ]}
                >
                  {post.likes} likes
                </Text>
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.textSoft },
                  ]}
                >
                  {post.comments} comments
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityFeedScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    marginTop: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  timeAgo: {
    fontSize: 11,
  },
  handleText: {
    fontSize: 12,
    marginBottom: 6,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  postBody: {
    fontSize: 13,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaText: {
    fontSize: 11,
  },
});
