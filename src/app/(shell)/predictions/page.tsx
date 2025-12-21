import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";
import PaywallGate from "@/components/ui/PaywallGate";
import Disclaimer from "@/components/ui/Disclaimer";
import type { Plan } from "@/lib/access";
import { useAuth } from "@/context/AuthContext";

export default function PredictionsPage() {
  const { plan: _plan } = useAuth();
  const plan = (_plan?.name ?? "").toLowerCase().includes("elite")
    ? ("elite" as Plan)
    : (_plan?.name ?? "").toLowerCase().includes("pro")
    ? ("pro" as Plan)
    : ("free" as Plan);
  return (
    <PageTransition>
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Predictions
        </h1>
        <Disclaimer />

        <PaywallGate feature="predictions" plan={plan} title="Predictions" description="Model-driven predictions are available to Pro subscribers.">
          <div className="glass p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 tracking-tighter">
              Bitcoin Price Prediction
            </h2>
            <NeonLineChart />
          </div>
        </PaywallGate>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KpiStat
            title="Predicted High"
            value="$72,000"
            delta="+5.2%"
            deltaType="profit"
          />
          <KpiStat
            title="Predicted Low"
            value="$65,000"
            delta="-2.1%"
            deltaType="loss"
          />
          <KpiStat
            title="Confidence Score"
            value="85%"
            delta="+1.5%"
            deltaType="profit"
          />
        </div>
      </div>
    </PageTransition>
  );
}
