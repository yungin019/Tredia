// src/components/Navbar.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { styled } from "nativewind";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const StyledPressable = styled(Pressable);

const Navbar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <StyledPressable className="flex-row justify-around items-center absolute bottom-0 left-0 right-0 mx-4 mb-4 p-2 rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)]">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName =
          label === "Feed"
            ? "dashboard"
            : label === "Trends"
            ? "show-chart"
            : label === "Portfolio"
            ? "account-balance-wallet"
            : "smart-toy";

        return (
          <StyledPressable
            key={route.key}
            onPress={onPress}
            className="flex-col items-center p-2"
          >
            <MaterialIcons
              name={iconName}
              size={24}
              color={isFocused ? "#00B8FF" : "gray"}
            />
            <Text
              style={{
                color: isFocused ? "#00B8FF" : "gray",
                fontSize: 10,
              }}
            >
              {label}
            </Text>
          </StyledPressable>
        );
      })}
    </StyledPressable>
  );
};

export default Navbar;
