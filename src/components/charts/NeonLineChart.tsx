"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
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

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-2 text-xs rounded-lg">
        <p className="font-bold text-white text-sm">{label}</p>
        <p className="font-semibold" style={{ color: neon.cyan }}>
          Value: {payload[0].value.toFixed(2)}
        </p>
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
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={neon.cyan} stopOpacity={0.4} />
            <stop offset="95%" stopColor={neon.cyan} stopOpacity={0} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <XAxis
          dataKey="name"
          stroke={neon.axis}
          axisLine={false}
          tickLine={false}
        />
        <YAxis stroke={neon.axis} axisLine={false} tickLine={false} />
        <CartesianGrid strokeDasharray="3 3" stroke={neon.grid} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: neon.cyan, strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={neon.cyan}
          strokeWidth={2.5}
          fill="url(#colorValue)"
          fillOpacity={1}
          filter="url(#glow)"
          activeDot={{
            r: 6,
            style: { stroke: neon.cyan, strokeWidth: 2, fill: "#0B0E18" },
          }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NeonLineChart;
