import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";

export default function PortfolioPage() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Portfolio
        </h1>
        <div className="glass p-6 mb-8">
          <NeonLineChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiStat
            title="Total Value"
            value="$12,345.67"
            delta="+12.3%"
            deltaType="profit"
          />
          <KpiStat
            title="24h Change"
            value="-$234.56"
            delta="-1.9%"
            deltaType="loss"
          />
          <KpiStat
            title="Top Performer"
            value="Solana"
            delta="+5.8%"
            deltaType="profit"
          />
        </div>
      </div>
    </PageTransition>
  );
}
