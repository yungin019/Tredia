// src/components/Tooltip.tsx
import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import Animated, { FadeIn } from "react-native-reanimated";
import GlassPanel from "./GlassPanel";

const AnimatedView = styled(Animated.createAnimatedComponent(View));

interface TooltipProps {
  title: string;
  value: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, value }) => {
  return (
    <AnimatedView entering={FadeIn.duration(120)}>
      <GlassPanel className="p-2 rounded-lg">
        <Text className="text-xs text-gray-400">{title}</Text>
        <Text className="text-sm font-bold text-white">{value}</Text>
      </GlassPanel>
    </AnimatedView>
  );
};

export default Tooltip;
