import type { HeatmapItem, DashboardSignal, NewsSentiment, AiDashboardPayload } from "../types/aiDashboardTypes";

function randomBetween(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

function pick<T>(arr: T[]): T {
  return arr[randomBetween(0, arr.length - 1)];
}

const assets = [
  { symbol: "BTC", name: "Bitcoin", assetClass: "crypto" },
  { symbol: "ETH", name: "Ethereum", assetClass: "crypto" },
  { symbol: "AAPL", name: "Apple Inc.", assetClass: "stock" },
  { symbol: "TSLA", name: "Tesla Inc.", assetClass: "stock" },
  { symbol: "NVDA", name: "NVIDIA Corp.", assetClass: "stock" },
  { symbol: "EURUSD", name: "Euro / US Dollar", assetClass: "forex" },
  { symbol: "GOLD", name: "Gold", assetClass: "metal" },
];

const sectors = ["Tech", "Automotive", "Crypto", "Finance", "Energy", "Consumer"];
const directions: DashboardSignal["direction"][] = ["long", "short", "watch"];
const biases: HeatmapItem["aiBias"][] = ["bullish", "bearish", "neutral"];
const horizons: NewsSentiment["horizon"][] = ["intraday", "swing", "position"];

export function generateSyntheticAiDashboardData(): AiDashboardPayload {
  // Heatmap
  const heatmap: HeatmapItem[] = assets.map((a) => ({
    symbol: a.symbol,
    name: a.name,
    assetClass: a.assetClass as any,
    sector: pick(sectors),
    changePct: randomBetween(-3, 3),
    volatility: randomBetween(10, 60),
    aiBias: pick(biases),
    aiConfidence: randomBetween(60, 98) / 100,
    sentimentScore: randomBetween(-1, 1),
    jumpProbability: randomBetween(10, 80) / 100,
    heat: randomBetween(40, 100) / 100,
  }));

  // Signals
  const spotlight: DashboardSignal[] = Array.from({ length: 4 }).map((_, i) => {
    const asset = assets[i % assets.length];
    return {
      symbol: asset.symbol,
      name: asset.name,
      assetClass: asset.assetClass as any,
      sector: pick(sectors),
      direction: pick(directions),
      heat: randomBetween(50, 100) / 100,
      changePct: randomBetween(-2, 4),
      aiBias: pick(biases),
      aiConfidence: randomBetween(65, 99) / 100,
      jumpProbability: randomBetween(20, 80) / 100,
      timeHorizon: pick(["1-3 days", "1 week", "intraday", "swing"]),
      thesis: `${asset.name} shows ${pick(["momentum", "reversal", "breakout", "consolidation"])} setup. Watch for ${pick(["volume spike", "news catalyst", "trend continuation", "pullback"])}.`,
      riskNote: pick(["Manage size carefully.", "Volatility elevated.", "Earnings risk.", "Macro event risk."]),
      suggestedEntry: randomBetween(100, 500),
      suggestedStop: randomBetween(80, 99),
      suggestedTarget: randomBetween(120, 600),
      aiComment: `AI confidence ${randomBetween(70, 99)}%. ${pick(["Setup is developing.", "Momentum is strong.", "Risk is moderate.", "Volatility is high."])} `,
    };
  });

  // News
  const newsSentiment: NewsSentiment[] = Array.from({ length: 4 }).map((_, i) => {
    const asset = assets[i % assets.length];
    return {
      id: `news${i + 1}`,
      title: `${asset.name} ${pick(["hits new high", "faces regulatory review", "sees strong inflows", "experiences volatility spike"])}.`,
      summary: `${asset.name} ${pick(["is in focus due to recent market moves.", "is reacting to global events.", "shows unusual options activity.", "is trending among traders."])} `,
      sentimentLabel: pick(biases),
      sentimentScore: randomBetween(-1, 1),
      impactScore: randomBetween(40, 100),
      impactedSymbols: [asset.symbol],
      horizon: pick(horizons),
      confidence: randomBetween(60, 99) / 100,
      source: "AI Newswire",
      url: "https://news.example.com/article",
      publishedAt: new Date(Date.now() - randomBetween(0, 3600 * 1000)).toISOString(),
      categories: [pick(["Earnings", "Macro", "Regulation", "Sentiment"])],
      aiComment: pick(["AI sees strong sentiment.", "Volatility is rising.", "Risk is elevated.", "Momentum is building."]),
    };
  });

  // Summary
  const summary = `AI market scan: ${pick(["Risk appetite is moderate.", "Momentum is building in tech and crypto.", "Volatility is elevated across major assets.", "Traders are watching earnings and macro events."])} Key setups: ${spotlight.map((s) => s.symbol).join(", ")}.`;

  return {
    heatmap,
    spotlight,
    newsSentiment,
    summary,
    generatedAt: new Date().toISOString(),
  };
}
