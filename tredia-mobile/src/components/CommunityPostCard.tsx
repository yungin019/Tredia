// src/components/CommunityPostCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export interface PostProps {
  name: string;
  avatar?: string; // initials, e.g. "AK"
  time: string;
  text: string;
}

const CommunityPostCard: React.FC<PostProps> = ({ name, avatar, time, text }) => {
  const { theme } = useTheme();

  const initials =
    avatar ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.headerRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.accent + "33", borderColor: theme.accent },
          ]}
        >
          <Text style={[styles.avatarText, { color: theme.accent }]}>
            {initials}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.time, { color: theme.textSoft }]}>{time}</Text>
        </View>
      </View>

      <Text style={[styles.body, { color: theme.text }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "600",
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    fontSize: 11,
  },
  body: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default CommunityPostCard;
