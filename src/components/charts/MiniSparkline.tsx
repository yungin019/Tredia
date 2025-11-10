"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";
import { neon } from "./theme";

const defaultData = [
  { value: 10 },
  { value: 20 },
  { value: 15 },
  { value: 30 },
  { value: 25 },
  { value: 40 },
  { value: 35 },
];

const MiniSparkline = ({ data = defaultData }) => {
  return (
    <ResponsiveContainer width={60} height={40}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={neon.cyan}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MiniSparkline;
