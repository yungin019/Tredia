// src/screens/PostCreateScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/apiClient";

const PostCreateScreen: React.FC = () => {
  const theme: any = useTheme();
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !body.trim()) return;

    try {
      setSubmitting(true);

      // 🔥 Real backend call
      await api.post("/community/posts", {
        title: title.trim(),
        content: body.trim(),
        imageBase64: null, // images later
      });

      // Optional: tiny confirmation
      // Alert.alert("Posted", "Your idea has been shared with the community.");

      navigation.goBack();
    } catch (err: any) {
      console.log("[PostCreate] error", err?.message || err);
      Alert.alert(
        "Error",
        "Could not post to community right now. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        New community post
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSoft }]}>
        Share a setup, idea, or lesson with the Planet.
      </Text>

      <Text style={[styles.label, { color: theme.textSoft }]}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Give your post a clear title"
        placeholderTextColor={theme.textSoft}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: theme.cardBorder,
          },
        ]}
      />

      <Text style={[styles.label, { color: theme.textSoft }]}>Content</Text>
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Explain your idea, chart, risk plan..."
        placeholderTextColor={theme.textSoft}
        multiline
        style={[
          styles.textarea,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: theme.cardBorder,
          },
        ]}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          {
            backgroundColor:
              title.trim() && body.trim() ? theme.accent : theme.cardBorder,
          },
        ]}
        onPress={handlePost}
        disabled={!title.trim() || !body.trim() || submitting}
        activeOpacity={0.9}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#020617" />
        ) : (
          <Text style={styles.primaryButtonText}>Post to community</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
        disabled={submitting}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.textSoft }]}>
          Cancel
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default PostCreateScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 140,
    textAlignVertical: "top",
  },
  primaryButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#0b1120",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
