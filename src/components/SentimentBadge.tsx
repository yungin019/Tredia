import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sentimentBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors uppercase tracking-wider",
  {
    variants: {
      sentiment: {
        bullish:
          "border-brand-profit/60 bg-transparent text-brand-profit [text-shadow:0_0_8px_theme(colors.brand.profit)]",
        bearish:
          "border-brand-loss/60 bg-transparent text-brand-loss [text-shadow:0_0_8px_theme(colors.brand.loss)]",
        neutral:
          "border-brand-gold/60 bg-transparent text-brand-gold [text-shadow:0_0_8px_theme(colors.brand.gold)]",
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
