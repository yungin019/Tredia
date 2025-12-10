// src/app/(shell)/feed/page.tsx
"use client";

import React from "react";
import MiniSparkline from "@/components/charts/MiniSparkline";
import { chartTheme } from "@/components/charts/theme";



const mockMomentum = [101, 103, 99, 104, 110, 108, 112, 118, 117, 121];
const mockCrypto = [1.01, 1.03, 1.08, 1.04, 1.12, 1.18, 1.23, 1.19];
const mockCommodities = [80, 79, 81, 82, 84, 83, 82, 85];

const mockNextMoves = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    move: "+3.4%",
    horizon: "24h",
    bias: "Bullish",
    positive: true,
    data: [100, 102, 101, 104, 107, 108, 111, 113],
  },
  {
    symbol: "XAU",
    name: "Gold Spot",
    move: "-1.2%",
    horizon: "2–3d",
    bias: "Cooling",
    positive: false,
    data: [1950, 1962, 1975, 1968, 1960, 1958, 1955, 1948],
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    move: "+5.9%",
    horizon: "12h",
    bias: "High momentum",
    positive: true,
    data: [62000, 62500, 63000, 64200, 65100, 65500, 66200, 66850],
  },
];

const mockNews = [
  {
    source: "Bloomberg",
    title: "Saudi signals extended oil output cuts as demand outlook shifts",
    sentiment: "Bearish on oil",
    time: "12 min ago",
  },
  {
    source: "Reuters",
    title: "Chip demand accelerates as AI servers drive Q4 orders",
    sentiment: "Bullish on semiconductors",
    time: "34 min ago",
  },
  {
    source: "CNBC",
    title: "Fed officials hint at slower pace of cuts as inflation cools unevenly",
    sentiment: "Mixed for indices",
    time: "1h ago",
  },
];

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-[#050712] text-white">
      {/* Max width shell */}
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 pb-8 pt-6 md:px-6 lg:px-8">
        {/* Top header */}
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-200">
                Live Super AI Feed
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-[28px]">
              Tredia
            </h1>
            <p className="mt-1 text-xs text-slate-400 md:text-[13px]">
              One place for your next moves, AI briefings and market heat.
            </p>
          </div>

          {/* Quick KPIs */}
          <div className="flex shrink-0 gap-3">
            <KpiPill label="AI Confidence" value="82%" tone="good" />
            <KpiPill label="Market Mood" value="Risk-on" tone="neutral" />
          </div>
        </header>

        {/* GRID LAYOUT */}
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-5 lg:gap-5">
          {/* LEFT COLUMN */}
          <section className="flex flex-col gap-4 md:col-span-3">
            {/* AI DAILY BRIEF */}
            <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.06] via-[#0d1322] to-[#020511] p-4 md:p-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold md:text-[16px]">
                    Today&apos;s AI briefing
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    Super AI is tracking strong flows into{" "}
                    <span className="font-semibold text-emerald-400">
                      AI chips
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-cyan-300">
                      large-cap tech
                    </span>
                    , while{" "}
                    <span className="font-semibold text-red-300">
                      energy
                    </span>{" "}
                    shows early signs of cooling. Short-term volatility is
                    clustering around semiconductors and BTC.
                  </p>
                </div>

                <span className="rounded-full bg-black/30 px-3 py-1 text-[10px] font-medium text-slate-200 ring-1 ring-white/10">
                  Updated 3 min ago
                </span>
              </div>

              {/* Momentum strip */}
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <MomentumCard
                  title="AI Momentum Index"
                  value="+2.9%"
                  subtitle="Last 24h"
                  data={mockMomentum}
                  positive
                />
                <MomentumCard
                  title="Crypto Pulse"
                  value="+5.4%"
                  subtitle="Risk assets"
                  data={mockCrypto}
                  positive
                />
                <MomentumCard
                  title="Commodities Drift"
                  value="+0.7%"
                  subtitle="Gold · Oil · Metals"
                  data={mockCommodities}
                  positive
                />
              </div>
            </div>

            {/* NEXT BIG JUMPS */}
            <div className="rounded-3xl border border-white/7 bg-[#0B0F17] p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold md:text-[16px]">
                    Next big moves
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Ranked by AI heat and jump probability. Not financial
                    advice.
                  </p>
                </div>

                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                  View all signals
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {mockNextMoves.map((item) => (
                  <button
                    key={item.symbol}
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/7 bg-white/[0.02] px-3 py-3 text-left transition hover:border-cyan-400/70 hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[13px] font-semibold tracking-tight">
                        {item.symbol}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold">
                          {item.name}
                        </span>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                            {item.bias}
                          </span>
                          <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-cyan-300">
                            {item.horizon}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden text-right text-xs md:block">
                        <span
                          className={`block font-semibold ${
                            item.positive ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {item.move}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          AI-weighted move
                        </span>
                      </div>

                      <MiniSparkline
                        data={item.data}
                        positive={item.positive}
                        width={120}
                        height={34}
                        className="hidden md:block"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN */}
          <section className="flex flex-col gap-4 md:col-span-2">
            {/* HEAT SNAPSHOT */}
            <div className="overflow-hidden rounded-3xl border border-white/8 bg-[#0B0F17] p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold md:text-[16px]">
                    Market heat snapshot
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Quick view of where attention and volatility cluster.
                  </p>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] text-slate-200">
                  Super AI · v1
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200">
                <HeatChip label="AI chips" value="🔥 High" tone="hot" />
                <HeatChip label="Large-cap tech" value="High" tone="warm" />
                <HeatChip label="Energy" value="Cooling" tone="cool" />
                <HeatChip label="Crypto majors" value="Very high" tone="hot" />
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                Full heatmap, sectors and cross-asset flows will appear here
                once your live market data provider is plugged in.
              </p>
            </div>

            {/* NEWS AI FEED */}
            <div className="flex-1 rounded-3xl border border-white/8 bg-[#0B0F17] p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold md:text-[16px]">
                    News AI stream
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Condensed headlines with sentiment and impact.
                  </p>
                </div>

                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                  Open full feed
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {mockNews.map((item, idx) => (
                  <article
                    key={idx}
                    className="group rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-3 text-left transition hover:border-cyan-400/60 hover:bg-white/[0.06]"
                  >
                    <div className="mb-1 flex items-center justify-between gap-3 text-[10px]">
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                        {item.source}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {item.time}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-medium leading-snug text-slate-50">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-cyan-300">
                      {item.sentiment}
                    </p>
                  </article>
                ))}
              </div>

              <p className="mt-3 text-[10px] text-slate-500">
                Real headlines will stream from your connected APIs
                (Bloomberg, Reuters, etc.), enriched by News AI.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ---------- SMALL INTERNAL COMPONENTS ---------- */

type KpiPillProps = {
  label: string;
  value: string;
  tone?: "good" | "bad" | "neutral";
};

function KpiPill({ label, value, tone = "neutral" }: KpiPillProps) {
  const toneClass =
    tone === "good"
      ? "text-emerald-400"
      : tone === "bad"
      ? "text-red-400"
      : "text-cyan-300";

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <span className={`mt-0.5 text-xs font-semibold ${toneClass}`}>
        {value}
      </span>
    </div>
  );
}

type MomentumCardProps = {
  title: string;
  value: string;
  subtitle: string;
  data: number[];
  positive?: boolean;
};

function MomentumCard({
  title,
  value,
  subtitle,
  data,
  positive,
}: MomentumCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/30 px-3 py-2.5">
      <div className="flex flex-col">
        <span className="text-[11px] text-slate-300">{title}</span>
        <span
          className={`mt-0.5 text-[13px] font-semibold ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {value}
        </span>
        <span className="text-[10px] text-slate-500">{subtitle}</span>
      </div>
      <MiniSparkline
        data={data}
        positive={positive}
        width={90}
        height={32}
      />
    </div>
  );
}

type HeatChipProps = {
  label: string;
  value: string;
  tone: "hot" | "warm" | "cool";
};

function HeatChip({ label, value, tone }: HeatChipProps) {
  const colorClass =
    tone === "hot"
      ? "bg-red-500/15 text-red-300"
      : tone === "warm"
      ? "bg-amber-400/15 text-amber-200"
      : "bg-sky-500/15 text-sky-200";

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-white/[0.02] px-3 py-2 ring-1 ring-white/5">
      <span className="text-[11px] text-slate-200">{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${colorClass}`}
      >
        {value}
      </span>
    </div>
  );
}
