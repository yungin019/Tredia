import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sentimentBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      sentiment: {
        bullish:
          "border-transparent bg-brand-profit/20 text-brand-profit shadow-neonSm",
        bearish:
          "border-transparent bg-brand-loss/20 text-brand-loss shadow-neonSm",
        neutral:
          "border-transparent bg-brand-gold/20 text-brand-gold shadow-neonSm",
      },
    },
  }
);

export interface SentimentBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sentimentBadgeVariants> {}

function SentimentBadge({
  className,
  sentiment,
  ...props
}: SentimentBadgeProps) {
  return (
    <div
      className={cn(sentimentBadgeVariants({ sentiment }), className)}
      {...props}
    />
  );
}

export { SentimentBadge, sentimentBadgeVariants };
