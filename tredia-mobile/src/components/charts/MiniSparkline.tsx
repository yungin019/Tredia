// src/components/charts/MiniSparkline.tsx
// React Native version (Expo-compatible)

import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polyline } from "react-native-svg";

export interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  /**
   * Preferred prop for sparkline color.
   */
  color?: string;
  /**
   * Legacy prop still used in HomeScreen.
   */
  strokeColor?: string;
}

const MiniSparkline: React.FC<MiniSparklineProps> = ({
  data,
  width = 110,
  height = 40,
  color,
  strokeColor,
}) => {
  const lineColor = color || strokeColor || "#38bdf8";

  if (!data || data.length === 0) {
    return <View style={{ width, height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const stepX = width / Math.max(data.length - 1, 1);

  const points = data
    .map((value, index) => {
      const x = index * stepX;
      const normalized = (value - min) / range; // 0 → 1
      const y = height - normalized * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 999,
  },
});

export default MiniSparkline;
