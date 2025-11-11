"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { neon } from "./theme";

const defaultData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 text-xs">
        <p className="font-bold text-white">{label}</p>
        <p style={{ color: neon.cyan }}>Value: {payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const NeonLineChart = ({ data = defaultData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={neon.cyan} stopOpacity={0.8} />
            <stop offset="95%" stopColor={neon.cyan} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke={neon.axis} />
        <YAxis stroke={neon.axis} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={neon.cyan}
          strokeWidth={2.5}
          fill="url(#colorValue)"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NeonLineChart;
