// src/screens/PostDetailsScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

type RouteParams = {
  postId: string;
};

const PostDetailsScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { postId } = (route.params || {}) as RouteParams;

  const openAI = () => {
    navigation.navigate("HomeTabs", {
      screen: "AI",
      params: {
        initialQuestion: `Analyse this community post (id: ${postId ||
          "demo"}) and highlight the key risks, assumptions and blind spots.`,
      },
    } as any);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text
            style={[styles.title, { color: theme.textPrimary }]}
          >
            Post
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.link, { color: theme.accent }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.meta, { color: theme.textSoft }]}>
          Post ID: {postId || "demo"}
        </Text>

        <Text style={[styles.body, { color: theme.textPrimary }]}>
          Later this screen will show the full conversation, comments, and any
          AI explanation linked to this post. For now it’s a placeholder so that
          navigation works cleanly.
        </Text>

        <TouchableOpacity
          style={[
            styles.aiButton,
            { backgroundColor: theme.accent },
          ]}
          onPress={openAI}
        >
          <Text style={styles.aiButtonText}>
            Ask Tredia AI about this post
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    marginBottom: 10,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  aiButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  aiButtonText: {
    color: "#020617",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default PostDetailsScreen;
