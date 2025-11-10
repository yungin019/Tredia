import MiniSparkline from "./MiniSparkline";
import { cn } from "@/lib/utils";
import { SentimentBadge, SentimentBadgeProps } from "../SentimentBadge";

const KpiStat = ({
  title,
  value,
  delta,
  deltaType,
  sentiment,
}: {
  title: string;
  value: string;
  delta: string;
  deltaType: "profit" | "loss";
  sentiment?: SentimentBadgeProps["sentiment"];
}) => {
  return (
    <div className="glass px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-white/60 font-medium tracking-wider uppercase">
            {title}
          </p>
          <p className="text-2xl font-bold text-white tracking-tighter">
            {value}
          </p>
        </div>
        {sentiment ? (
          <SentimentBadge sentiment={sentiment}>
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </SentimentBadge>
        ) : (
          <MiniSparkline />
        )}
      </div>
      <p
        className={cn(
          "text-sm",
          deltaType === "profit" ? "text-brand-profit" : "text-brand-loss"
        )}
      >
        {delta}
      </p>
    </div>
  );
};

export default KpiStat;
