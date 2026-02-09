// src/components/NewsCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type Sentiment = "BULLISH" | "BEARISH" | "NEUTRAL";

interface NewsCardProps {
  title: string;
  summary: string;
  sentiment: Sentiment;
  source: string;
  timeAgo?: string;
  readTime?: string;
  imageUrl?: string;
  onPress: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  sentiment,
  source,
  timeAgo,
  readTime,
  imageUrl,
  onPress,
}) => {
  const palette = {
    BULLISH: {
      bg: "rgba(0,255,135,0.1)",
      border: "rgba(0,255,135,0.3)",
      text: "#00FF87",
    },
    BEARISH: {
      bg: "rgba(255,71,87,0.1)",
      border: "rgba(255,71,87,0.3)",
      text: "#FF4757",
    },
    NEUTRAL: {
      bg: "rgba(139,146,168,0.1)",
      border: "rgba(139,146,168,0.3)",
      text: "#8B92A8",
    },
  }[sentiment];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: "#151b2e",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#2a3347",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 170 }}
          resizeMode="cover"
        />
      )}

      <View style={{ padding: 16 }}>
        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: palette.bg,
            borderWidth: 1,
            borderColor: palette.border,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: palette.text,
              letterSpacing: 0.6,
            }}
          >
            {sentiment}
          </Text>
        </View>

        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 6,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: "#8B92A8",
            fontSize: 13,
            lineHeight: 18,
            marginBottom: 12,
          }}
          numberOfLines={3}
        >
          {summary}
        </Text>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#2a3347",
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="article" size={14} color="#8B92A8" />
            <Text
              style={{
                color: "#8B92A8",
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              {source}
            </Text>
          </View>

          {(timeAgo || readTime) && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {timeAgo && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="schedule" size={14} color="#8B92A8" />
                  <Text
                    style={{
                      color: "#8B92A8",
                      fontSize: 12,
                      marginLeft: 4,
                    }}
                  >
                    {timeAgo}
                  </Text>
                </View>
              )}
              {readTime && (
                <Text
                  style={{
                    color: "#5A6072",
                    fontSize: 12,
                    marginLeft: 6,
                  }}
                >
                  • {readTime}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
