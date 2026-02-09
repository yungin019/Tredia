// src/components/LogoCard.tsx
import React, { useEffect, useRef } from "react";
import { View, Image, Text, Animated } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledText = styled(Text);

interface LogoCardProps {
  withTitle?: boolean;
  size?: "hero" | "small";
}

const LogoCard: React.FC<LogoCardProps> = ({
  withTitle = true,
  size = "small",
}) => {
  const isHero = size === "hero";

  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  const cardClassName = isHero
    ? "px-10 py-8 rounded-card bg-cardBg border border-border"
    : "p-6 rounded-card bg-cardBg border border-border";

  const logoSizeClass = isHero ? "w-24 h-24" : "w-20 h-20";

  return (
    <StyledView className="items-center mb-10">
      {isHero && (
        <View
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 40,
            backgroundColor: "rgba(0, 184, 255, 0.08)",
            shadowColor: "#00B8FF",
            shadowOpacity: 0.6,
            shadowRadius: 40,
          }}
        />
      )}

      <Animated.View
        style={{
          opacity,
          transform: [{ scale }],
        }}
      >
        <StyledView className={cardClassName}>
          <StyledImage
            source={require("../assets/logo.png")}
            className={logoSizeClass}
            resizeMode="contain"
          />
        </StyledView>
      </Animated.View>

      {withTitle && (
        <StyledView className="mt-4 items-center">
          <StyledText className="text-white text-3xl font-bold">
            Tredia
          </StyledText>
          <StyledText className="text-gray-400">
            AI-Powered Market Insights
          </StyledText>
        </StyledView>
      )}
    </StyledView>
  );
};

export default LogoCard;
