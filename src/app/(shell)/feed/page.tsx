import { SimulateTradeModal } from "@/components/SimulateTradeModal";
import { mockFeedData } from "@/lib/mock";
import KpiStat from "@/components/charts/KpiStat";
import PageTransition from "@/components/PageTransition";

export default function FeedPage() {
  return (
    <PageTransition>
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tighter">
            Feed
          </h1>
          <SimulateTradeModal />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockFeedData.map((item) => (
            <KpiStat
              key={item.id}
              title={item.title}
              value={`$${item.value.toFixed(2)}`}
              delta={`${item.change > 0 ? "+" : ""}${item.change.toFixed(2)}%`}
              deltaType={item.change > 0 ? "profit" : "loss"}
              sentiment={
                item.change > 2
                  ? "bullish"
                  : item.change < -1
                    ? "bearish"
                    : "neutral"
              }
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
