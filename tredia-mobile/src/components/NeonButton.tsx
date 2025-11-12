// src/components/NeonButton.tsx
import React from "react";
import { Pressable } from "react-native";
import { styled } from "nativewind";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const StyledPressable = styled(Pressable);
const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);

interface NeonButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onPress,
  className = "bg-[#00B8FF]",
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    // eslint-disable-next-line react-hooks/immutability
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={`py-3 px-6 rounded-btn shadow-neon-sm justify-center items-center ${className}`}
      style={animatedStyle}
    >
      {children}
    </AnimatedPressable>
  );
};

export default NeonButton;
