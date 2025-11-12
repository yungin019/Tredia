// src/components/NeonLineChart.tsx
import React from "react";
import { View } from "react-native";
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis } from "victory-native";
import { trediaTheme } from "../design/trediaTheme";

interface NeonLineChartProps {
  data: { x: number; y: number }[];
}

const NeonLineChart: React.FC<NeonLineChartProps> = ({ data }) => {
  return (
    <View>
      <VictoryChart
        height={250}
        padding={{ top: 20, bottom: 30, left: 40, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fill: trediaTheme.charts.axis, fontSize: 10 },
            grid: { stroke: trediaTheme.charts.grid, strokeDasharray: "4, 4" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fill: trediaTheme.charts.axis, fontSize: 10 },
            grid: { stroke: trediaTheme.charts.grid, strokeDasharray: "4, 4" },
          }}
        />
        <VictoryArea
          data={data}
          style={{
            data: {
              fill: trediaTheme.charts.line,
              fillOpacity: trediaTheme.charts.areaOpacity,
            },
          }}
        />
        <VictoryLine
          data={data}
          style={{
            data: {
              stroke: trediaTheme.charts.line,
              strokeWidth: trediaTheme.charts.strokeWidth,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
};

export default NeonLineChart;
