import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";

export default function SignalsPage() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Signals
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiStat
            title="Bitcoin Bullish Divergence"
            value="Strong Buy"
            delta="Confidence: 92%"
            deltaType="profit"
          />
          <KpiStat
            title="Ethereum Golden Cross"
            value="Buy"
            delta="Confidence: 88%"
            deltaType="profit"
          />
          <KpiStat
            title="Solana Death Cross"
            value="Sell"
            delta="Confidence: 78%"
            deltaType="loss"
          />
        </div>
      </div>
    </PageTransition>
  );
}
