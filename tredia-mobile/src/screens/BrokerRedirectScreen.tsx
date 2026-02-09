import React from "react";
import { View, Text, ActivityIndicator, Linking } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function BrokerRedirectScreen() {
  const route = useRoute<any>();
  const { brokerId, brokerName, url } = route.params || {};

  React.useEffect(() => {
    if (url) Linking.openURL(url);
  }, [url]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={{ color: "white", marginTop: 20 }}>
        Redirecting to {brokerName || "broker"}...
      </Text>
    </View>
  );
}
