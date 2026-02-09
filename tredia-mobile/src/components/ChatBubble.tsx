// src/components/ChatBubble.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export type ChatRole = "user" | "assistant";

export interface ChatBubbleProps {
  role: ChatRole;
  text: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, text }) => {
  const isUser = role === "user";
  const theme = useTheme();

  return (
    <View
      style={[
        styles.row,
        { alignItems: "flex-end", justifyContent: isUser ? "flex-end" : "flex-start" },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            alignSelf: isUser ? "flex-end" : "flex-start",
            backgroundColor: isUser ? theme.accent : theme.surface,
            borderColor: isUser ? "transparent" : theme.cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isUser ? "#FFFFFF" : theme.textPrimary },
          ]}
        >
          {text}
        </Text>

        <Text
          style={[
            styles.meta,
            {
              textAlign: isUser ? "right" : "left",
              color: isUser ? "#BFDBFE" : theme.textSoft,
            },
          ]}
        >
          {isUser ? "You • just now" : "Tredia AI • now"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default ChatBubble;
