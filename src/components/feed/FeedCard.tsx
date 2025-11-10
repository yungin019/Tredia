"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FeedPost } from "@/lib/types";

const sentimentColors = {
  Bullish: "bg-green-500",
  Neutral: "bg-gray-500",
  Bearish: "bg-red-500",
};

export const FeedCard = ({ post }: { post: FeedPost }) => {
  const sentimentColor = sentimentColors[post.sentiment];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white shadow-lg transition-all hover:shadow-2xl hover:scale-105">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
        <CardDescription className="text-gray-300">
          {post.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <Badge className={`${sentimentColor} text-white`}>
          {post.sentiment}
        </Badge>
        <div className="flex gap-2">
          {post.tickers.map((ticker) => (
            <Badge key={ticker} variant="secondary">
              {ticker}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
