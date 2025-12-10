// src/screens/LogoutScreen.tsx
// 2026 - Account exit screen (Log out vs Delete)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const LogoutScreen: React.FC = () => {
  const { colors } = useTheme();
  const { logout, isLoading } = useAuth();
  const navigation = useNavigation<Nav>();
  const [deleting, setDeleting] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (e) {
      console.log("[LogoutScreen] logout error:", e);
    }
  };

  const handleDeleteAccount = () => {
    // For now we just show a confirmation and leave a TODO for backend wiring
    Alert.alert(
      "Delete account?",
      "This will permanently remove your Tredia account and data. This flow will be connected to the backend later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              // TODO: call your backend delete endpoint here, e.g.:
              // await api.delete("/api/account");
              // await logout();
              // navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
              console.log("[LogoutScreen] delete account placeholder");
              Alert.alert(
                "Coming soon",
                "Account deletion will be fully wired to the backend in a later build."
              );
            } catch (e) {
              console.log("[LogoutScreen] delete error:", e);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.textSoft}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Sign out
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceGlass,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Log out or leave Tredia?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSoft }]}>
            You can simply log out and come back later, or request to delete
            your account completely in a future update.
          </Text>

          <View style={styles.optionsBlock}>
            <View style={styles.optionRow}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.accentCyan}
              />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text
                  style={[styles.optionTitle, { color: colors.textPrimary }]}
                >
                  Log out only
                </Text>
                <Text
                  style={[styles.optionSubtitle, { color: colors.textSoft }]}
                >
                  End this session. Your account and data stay safe for when you
                  come back.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: colors.accentCyan,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              disabled={isLoading}
              onPress={handleConfirmLogout}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>
                Log out of Tredia
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.optionsBlock}>
            <View style={styles.optionRow}>
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text
                  style={[
                    styles.optionTitle,
                    { color: "#ef4444" },
                  ]}
                >
                  Delete my account
                </Text>
                <Text
                  style={[styles.optionSubtitle, { color: colors.textSoft }]}
                >
                  Request full deletion of your account in a future update.
                  This action will be irreversible once fully activated.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  borderColor: "#ef4444",
                  opacity: deleting ? 0.7 : 1,
                },
              ]}
              onPress={handleDeleteAccount}
              disabled={deleting}
              activeOpacity={0.9}
            >
              <Text style={[styles.secondaryButtonText]}>
                Continue with delete option
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LogoutScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  optionsBlock: {
    marginTop: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  divider: {
    height: 1,
    opacity: 0.4,
    marginVertical: 16,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ef4444",
  },
});
