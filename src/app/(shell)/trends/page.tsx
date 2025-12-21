import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";
import RequestState from "@/components/ui/RequestState";

export default function TrendsPage() {
  return (
    <RequestState>
      <PageTransition>
        <div className="container mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Trends
        </h1>
        <div className="glass p-6 mb-8">
          <NeonLineChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiStat
            title="Market Sentiment"
            value="Bullish"
            delta="+3.2%"
            deltaType="profit"
          />
          <KpiStat
            title="Volatility"
            value="High"
            delta="+1.5%"
            deltaType="profit"
          />
          <KpiStat
            title="Trading Volume"
            value="2.3M"
            delta="-0.5%"
            deltaType="loss"
          />
        </div>
        </div>
      </PageTransition>
    </RequestState>
  );
}
