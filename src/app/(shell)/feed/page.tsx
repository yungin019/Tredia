import { SimulateTradeModal } from "@/components/SimulateTradeModal";
import { mockFeedData } from "@/lib/mock";

export default function FeedPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Feed</h1>
        <SimulateTradeModal />
      </div>
      <div className="space-y-4">
        {mockFeedData.map((item) => (
          <div key={item.id} className="p-4 rounded-lg border">
            <h2 className="font-bold">{item.title}</h2>
            <p>Value: {item.value}</p>
            <p>Change: {item.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
