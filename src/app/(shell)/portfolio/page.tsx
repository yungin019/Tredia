import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto px-6">
      <PageTransition>
        <h1 className="text-2xl font-bold text-white mb-8 tracking-headings">
          Portfolio Overview
        </h1>
      </PageTransition>
        <div className="glass p-6 mb-6">
          <NeonLineChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="py-3">
            <KpiStat
              title="Total Value"
              value="$12,345.67"
              delta="+12.3%"
              deltaType="profit"
            />
          </div>
          <div className="py-3">
            <KpiStat
              title="24h Change"
              value="-$234.56"
              delta="-1.9%"
              deltaType="loss"
            />
          </div>
          <div className="py-3">
            <KpiStat
              title="Top Performer"
              value="Solana"
              delta="+5.8%"
              deltaType="profit"
            />
          </div>
        </div>
    </div>
  );
}
