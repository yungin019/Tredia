// src/components/ChooseBrokerModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import type { BrokerPlatform } from "../services/brokerLinkService";

type Props = {
  visible: boolean;
  onClose: () => void;
  brokers: BrokerPlatform[];
  onSelect: (broker: BrokerPlatform) => void;
};

export default function ChooseBrokerModal({
  visible,
  onClose,
  brokers,
  onSelect,
}: Props) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.surface, borderColor: theme.cardBorder },
          ]}
        >
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Connect a broker
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSoft }]}>
            Pick the platform you already use. We’ll redirect you to the right
            place and then mirror your journey inside Tredia.
          </Text>

          <FlatList
            data={brokers}
            keyExtractor={(item) => item.slug}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.brokerCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  },
                ]}
                onPress={() => onSelect(item)}
                activeOpacity={0.9}
              >
                <View style={styles.left}>
                  {item.logoUrl ? (
                    <Image
                      source={{ uri: item.logoUrl }}
                      style={styles.logo}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[
                        styles.logoFallback,
                        {
                          borderColor: theme.cardBorder,
                          backgroundColor: theme.surfaceAlt,
                        },
                      ]}
                    >
                      <Text style={{ color: theme.textSoft, fontWeight: "700" }}>
                        {item.name?.slice(0, 1)?.toUpperCase() ?? "?"}
                      </Text>
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.brokerName, { color: theme.textPrimary }]}>
                      {item.name}
                    </Text>
                    {item.websiteUrl ? (
                      <Text
                        numberOfLines={1}
                        style={[styles.brokerSubtitle, { color: theme.textSoft }]}
                      >
                        {item.websiteUrl}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <Text style={{ color: theme.accent, fontWeight: "600" }}>
                  Connect →
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: theme.surfaceAlt, borderColor: theme.cardBorder },
            ]}
            activeOpacity={0.9}
          >
            <Text style={{ color: theme.textSoft, fontWeight: "500" }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  brokerCard: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 7,
  },
  logoFallback: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  brokerName: {
    fontSize: 15,
    fontWeight: "600",
  },
  brokerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 16,
  },
});
