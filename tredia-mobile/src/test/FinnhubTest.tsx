import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import { FINNHUB_API_KEY } from "@env";

export default function FinnhubTest() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("https://finnhub.io/api/v1/quote", {
          params: {
            symbol: "AAPL",
            token: FINNHUB_API_KEY,
          },
        });

        console.log("Finnhub response:", res.data);
        setPrice(res.data.c);
      } catch (err) {
        console.error("Finnhub error:", err);
      }
    }

    load();
  }, []);

  if (!price) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text>Loading live stock price...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Live AAPL price</Text>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>${price}</Text>
    </View>
  );
}
