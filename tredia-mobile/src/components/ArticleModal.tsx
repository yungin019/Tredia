import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ArticleModal(props: any) {
  const theme: any = useTheme();
  const { visible, onClose, article } = props ?? {};

  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.textPrimary ?? theme.text }]} numberOfLines={2}>
              {article?.title ?? "Article"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: theme.textSoft }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={[styles.body, { color: theme.textSoft }]}>
              {article?.content ?? article?.summary ?? "No content."}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(3, 7, 18, 0.7)",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    maxHeight: "80%",
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  title: { flex: 1, fontSize: 16, fontWeight: "800" },
  closeBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  body: { fontSize: 12, lineHeight: 18 },
});
