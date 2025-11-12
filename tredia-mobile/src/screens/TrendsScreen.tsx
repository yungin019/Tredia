// src/screens/TrendsScreen.tsx
import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import GlassPanel from "../components/GlassPanel";
import NeonLineChart from "../components/NeonLineChart";
import { mockChartData, mockTopMovers, Mover } from "../lib/mockTrends";
import Chip from "../components/Chip";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const timeRanges = ["1D", "1W", "1M"];

const MoverListItem = ({ item }: { item: Mover }) => (
  <GlassPanel className="flex-row items-center justify-between p-4 mb-3">
    <StyledView>
      <StyledText className="text-lg font-bold text-white">{item.ticker}</StyledText>
      <StyledText className="text-sm text-gray-400">{item.name}</StyledText>
    </StyledView>
    <StyledView className="items-end">
      <StyledText className="text-base font-medium text-white">{item.price}</StyledText>
      <StyledText className={item.isUp ? "text-profit" : "text-loss"}>
        {item.change}
      </StyledText>
    </StyledView>
  </GlassPanel>
);

const TrendsScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTimeRange, setSelectedTimeRange] = useState("1W");

  return (
    <StyledSafeAreaView className="flex-1 bg-[#0A0F1E]">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold text-white mb-4">
          Trends
        </StyledText>

        <GlassPanel className="p-4">
          <NeonLineChart data={mockChartData[selectedTimeRange]} />
          <StyledView className="flex-row justify-around mt-4">
            {timeRanges.map((range) => (
              <Chip
                key={range}
                label={range}
                className={
                  selectedTimeRange === range
                    ? "bg-electricBlue/30 border border-electricBlue"
                    : "bg-white/10"
                }
                textClassName={
                  selectedTimeRange === range ? "text-electricBlue" : "text-gray-400"
                }
              />
            ))}
          </StyledView>
        </GlassPanel>

        <StyledText className="text-xl font-bold text-white mt-8 mb-4">
          Top Movers
        </StyledText>
        <FlatList
          data={mockTopMovers}
          renderItem={({ item }) => <MoverListItem item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default TrendsScreen;
