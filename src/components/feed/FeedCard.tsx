
import React from "react";
import { Article } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  article: Article;
}

const FeedCard: React.FC<FeedCardProps> = ({ article }) => {
  const { title, source, time, sentiment, tickers, image } = article;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl overflow-hidden hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300">
      {image && (
        <div className="relative h-40 w-full">
          <Image
            src={image}
            alt={title}
            fill
            style={{objectFit: "cover"}}
            className="opacity-75"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center text-xs text-gray-300 mb-4">
          <span>
            {source} &bull; {time}
          </span>
          <Badge
            className={cn({
              "bg-green-500/20 text-green-300 border-green-500/50":
                sentiment === "Bullish",
              "bg-red-500/20 text-red-300 border-red-500/50":
                sentiment === "Bearish",
              "bg-gray-500/20 text-gray-300 border-gray-500/50":
                sentiment === "Neutral",
            })}
          >
            {sentiment}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {tickers.map((ticker) => (
            <Badge
              key={ticker}
              variant="secondary"
              className="bg-blue-500/20 text-blue-300 border-blue-500/50"
            >
              {ticker}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedCard;
