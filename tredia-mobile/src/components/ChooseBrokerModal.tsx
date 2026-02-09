// src/components/ChooseBrokerModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export type BrokerItem = {
  id: string;
  name: string;
  subtitle?: string;
  url: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (broker: BrokerItem) => void;
};

// You can later move this to src/data/brokers if you want
const BROKERS: BrokerItem[] = [
  {
    id: "etoro",
    name: "eToro",
    subtitle: "Social trading & stocks",
    url: "https://www.etoro.com",
  },
  {
    id: "binance",
    name: "Binance",
    subtitle: "Crypto trading",
    url: "https://www.binance.com",
  },
  {
    id: "revolut",
    name: "Revolut",
    subtitle: "Stocks & crypto inside banking app",
    url: "https://www.revolut.com",
  },
];

export default function ChooseBrokerModal({
  visible,
  onClose,
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
            data={BROKERS}
            keyExtractor={(item) => item.id}
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
              >
                <View>
                  <Text
                    style={[styles.brokerName, { color: theme.textPrimary }]}
                  >
                    {item.name}
                  </Text>
                  {item.subtitle ? (
                    <Text
                      style={[styles.brokerSubtitle, { color: theme.textSoft }]}
                    >
                      {item.subtitle}
                    </Text>
                  ) : null}
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
