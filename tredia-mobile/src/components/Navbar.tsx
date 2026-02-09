// src/components/Navbar.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";

const Navbar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { theme } = useTheme();

  const bg = theme?.navbarBg || "#020617";
  const border = theme?.border || "rgba(148, 163, 184, 0.3)";
  const active = theme?.neonBlue || "#38bdf8";
  const inactive = theme?.textSecondary || "#9CA3AF";

  const iconForRoute = (name: string) => {
    switch (name) {
      case "Feed":
        return "view-quilt";
      case "Planet":
        return "public";
      case "Portfolio":
        return "pie-chart";
      case "Trends":
        return "trending-up";
      case "Profile":
        return "person-outline";
      default:
        return "circle";
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderTopColor: border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const iconName = iconForRoute(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={iconName as any}
              size={22}
              color={isFocused ? active : inactive}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? active : inactive },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
});

export default Navbar;
