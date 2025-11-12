// src/screens/PortfolioScreen.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import GlassPanel from "../components/GlassPanel";
import Stat from "../components/Stat";
import { mockHoldings, mockPortfolioStats, Holding } from "../lib/mockPortfolio";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);
const StyledText = styled(Text);

const HoldingListItem = ({ item }: { item: Holding }) => (
  <GlassPanel className="flex-row items-center justify-between p-4 mb-3">
    <StyledView>
      <StyledText className="text-lg font-bold text-white">{item.ticker}</StyledText>
      <StyledText className="text-sm text-gray-400">{item.shares}</StyledText>
    </StyledView>
    <StyledView className="items-end">
      <StyledText className="text-base font-medium text-white">{item.value}</StyledText>
      <StyledText className={item.isUp ? "text-profit" : "text-loss"}>
        {item.change}
      </StyledText>
    </StyledView>
  </GlassPanel>
);

const PortfolioScreen = () => {
  return (
    <StyledSafeAreaView className="flex-1 bg-[#0A0F1E]">
      <StyledView className="p-4">
        <StyledText className="text-2xl font-bold text-white mb-4">
          Portfolio
        </StyledText>

        <StyledView className="grid grid-cols-2 gap-4 mb-6">
          <GlassPanel className="p-4 col-span-1">
            <Stat label="Balance" value={mockPortfolioStats.balance} />
          </GlassPanel>
          <GlassPanel className="p-4 col-span-1">
            <Stat label="Total P&L" value={mockPortfolioStats.totalPL} />
            <StyledText className="text-sm text-profit">{mockPortfolioStats.totalPLPercent}</StyledText>
          </GlassPanel>
          <GlassPanel className="p-4 col-span-1">
            <Stat label="Win Rate" value={mockPortfolioStats.winRate} />
          </GlassPanel>
          <GlassPanel className="p-4 col-span-1">
            <Stat label="Risk Level" value={mockPortfolioStats.riskLevel} />
          </GlassPanel>
        </StyledView>

        <FlatList
          data={mockHoldings}
          renderItem={({ item }) => <HoldingListItem item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default PortfolioScreen;
