import NeonLineChart from "@/components/charts/NeonLineChart";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";

export default function PredictionsPage() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Predictions
        </h1>
        <div className="glass p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 tracking-tighter">
            Bitcoin Price Prediction
          </h2>
          <NeonLineChart />
        </div>
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
