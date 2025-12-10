// src/screens/CreatorsScreen.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const CreatorsScreen: React.FC = () => {
  const theme: any = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: theme.textSoft }]}>
          COMMUNITY
        </Text>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Top creators
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSoft }]}>
          This space will highlight real traders and strategies once creator
          profiles and brokerage connections are live.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: theme.textPrimary },
            ]}
          >
            Coming soon
          </Text>
          <Text
            style={[
              styles.cardBody,
              { color: theme.textSoft },
            ]}
          >
            No fake leaderboards. When this launches, rankings will be based on
            real performance pulled from connected accounts – not screenshots or
            hype.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatorsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
  },
});
