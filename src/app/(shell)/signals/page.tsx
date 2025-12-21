import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";
import PaywallGate from "@/components/ui/PaywallGate";
import Disclaimer from "@/components/ui/Disclaimer";
import type { Plan } from "@/lib/access";
import { useAuth } from "@/context/AuthContext";
import RequestState from "@/components/ui/RequestState";

export default function SignalsPage() {
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
          Signals
        </h1>
        <Disclaimer />

        <PaywallGate feature="signals" plan={plan} title="Signals" description="Signal rankings and signal confidence are available to Pro subscribers.">
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
        </PaywallGate>
        </div>
      </PageTransition>
    </RequestState>
  );
}
