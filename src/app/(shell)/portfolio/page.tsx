import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";
import PaywallGate from "@/components/ui/PaywallGate";
import Disclaimer from "@/components/ui/Disclaimer";
import type { Plan } from "@/lib/access";
import { useAuth } from "@/context/AuthContext";
import RequestState from "@/components/ui/RequestState";

export default function PortfolioPage() {
  const { plan: _plan } = useAuth();
  const plan = (_plan?.name ?? "").toLowerCase().includes("elite")
    ? ("elite" as Plan)
    : (_plan?.name ?? "").toLowerCase().includes("pro")
    ? ("pro" as Plan)
    : ("free" as Plan);
  return (
    <RequestState>
      <PageTransition>
        <div className="container mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Portfolio
        </h1>
        <Disclaimer />

        <PaywallGate feature="portfolio_advanced" plan={plan} title="Portfolio · Advanced" description="Advanced portfolio analytics require Pro.">
          <div className="glass p-6 mb-8">
            <NeonLineChart />
          </div>
        </PaywallGate>
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
    </RequestState>
  );
}
