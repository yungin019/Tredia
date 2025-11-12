// src/lib/mockTrends.ts

export interface ChartDataPoint {
  x: number;
  y: number;
}

export const mockChartData: { [key: string]: ChartDataPoint[] } = {
  "1D": [
    { x: 1, y: 170 }, { x: 2, y: 172 }, { x: 3, y: 171 }, { x: 4, y: 173 }, { x: 5, y: 175 },
  ],
  "1W": [
    { x: 1, y: 165 }, { x: 2, y: 168 }, { x: 3, y: 170 }, { x: 4, y: 169 }, { x: 5, y: 172 },
    { x: 6, y: 174 }, { x: 7, y: 175 },
  ],
  "1M": [
    { x: 1, y: 160 }, { x: 5, y: 165 }, { x: 10, y: 163 }, { x: 15, y: 168 }, { x: 20, y: 172 },
    { x: 25, y: 170 }, { x: 30, y: 175 },
  ],
};

export interface Mover {
  id: string;
  ticker: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
}

export const mockTopMovers: Mover[] = [
  { id: "1", ticker: "TSLA", name: "Tesla, Inc.", price: "$182.58", change: "+8.12%", isUp: true },
  { id: "2", ticker: "AAPL", name: "Apple, Inc.", price: "$172.45", change: "-1.45%", isUp: false },
  { id: "3", ticker: "NVDA", name: "NVIDIA Corp.", price: "$905.00", change: "+12.60%", isUp: true },
  { id: "4", ticker: "GOOGL", name: "Alphabet Inc.", price: "$155.20", change: "+2.05%", isUp: true },
];
