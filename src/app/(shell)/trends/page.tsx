import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";

export default function TrendsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <PageTransition>
        <h1 className="text-2xl font-bold text-white mb-8 tracking-headings">
          Market Trends
        </h1>
      </PageTransition>
        <div className="glass p-6 mb-6">
          <NeonLineChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="py-3">
            <KpiStat
              title="Market Sentiment"
              value="Bullish"
              delta="+3.2%"
              deltaType="profit"
            />
          </div>
          <div className="py-3">
            <KpiStat
              title="Volatility"
              value="High"
              delta="+1.5%"
              deltaType="profit"
            />
          </div>
          <div className="py-3">
            <KpiStat
              title="Trading Volume"
              value="2.3M"
              delta="-0.5%"
              deltaType="loss"
            />
          </div>
        </div>
    </div>
  );
}
