// src/components/Header.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

type HeaderProps = {
  title: string;
  subtitle: string;
  showBell?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, showBell }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  const gradient = theme?.gradientPrimary || ["#0ea5e9", "#6366f1", "#7c3aed"];

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
      <LinearGradient
        colors={gradient as any}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* LEFT */}
        <View style={styles.left}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.right}>
          <View style={styles.liveChip}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>AI Live Feed</Text>
          </View>

          {showBell && (
            <TouchableOpacity
              style={styles.bell}
              onPress={() => navigation.navigate("Alerts")}
            >
              <MaterialIcons
                name="notifications-none"
                size={20}
                color="#E5E7EB"
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#E5E7EB",
    fontWeight: "700",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: -2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  liveText: {
    color: "#DBEAFE",
    fontSize: 11,
  },
  bell: {
    backgroundColor: "rgba(15,23,42,0.6)",
    padding: 6,
    borderRadius: 999,
  },
});

export default Header;
