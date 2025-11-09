import { mockTrendsData } from "@/lib/mock";

export default function TrendsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Trends</h1>
      <div className="space-y-4 mt-4">
        {mockTrendsData.map((item) => (
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
