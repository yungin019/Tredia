// src/screens/FeedScreen.tsx
import React, { useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import GlassPanel from "../components/GlassPanel";
import Chip from "../components/Chip";
import { mockFeedData, FeedItem } from "../lib/mock";
import Animated, { FadeInDown } from "react-native-reanimated";
import SimulateTradeModal from "../components/SimulateTradeModal";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const FeedCard = ({ item, index }: { item: FeedItem; index: number }) => {
  const sentimentColor =
    item.sentiment === "Bullish"
      ? "bg-profit/20"
      : item.sentiment === "Bearish"
      ? "bg-loss/20"
      : "bg-gray-500/20";
  const sentimentTextColor =
    item.sentiment === "Bullish"
      ? "text-profit"
      : item.sentiment === "Bearish"
      ? "text-loss"
      : "text-gray-400";

  return (
    <Animated.View entering={FadeInDown.delay(index * 20)}>
      <GlassPanel className="p-card-h py-card-v mb-4">
        <Chip
          label={item.sentiment}
          className={sentimentColor}
          textClassName={sentimentTextColor}
        />
        <StyledText className="text-lg font-bold text-white mt-3">
          {item.title}
        </StyledText>
        <StyledText className="text-sm text-gray-400 mt-1">
          {item.description}
        </StyledText>
      </GlassPanel>
    </Animated.View>
  );
};

const FeedScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <StyledSafeAreaView className="flex-1 bg-[#0A0F1E]">
      <StyledView className="p-4 flex-1">
        <StyledText className="text-2xl font-bold text-white mb-6">
          Feed
        </StyledText>
        <FlatList
          data={mockFeedData}
          renderItem={({ item, index }) => <FeedCard item={item} index={index} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </StyledView>

      <StyledPressable
        onPress={() => setModalVisible(true)}
        className="absolute bottom-24 right-6 bg-accentCyan w-14 h-14 rounded-full justify-center items-center shadow-neon"
      >
        <MaterialIcons name="add" size={32} color="black" />
      </StyledPressable>

      <SimulateTradeModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </StyledSafeAreaView>
  );
};

export default FeedScreen;
