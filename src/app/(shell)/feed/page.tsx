
import React from "react";
import { mockArticles } from "@/lib/mock";
import FeedCard from "@/components/feed/FeedCard";

const FeedPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8 text-white">
        AI Market Feed
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockArticles.map((article) => (
          <FeedCard key={article.id} article={article} />
        ))}
      </div>
      <footer className="text-center text-xs text-gray-400 mt-8">
        <p>Informational & educational purposes only — not financial advice.</p>
      </footer>
    </div>
  );
};

export default FeedPage;
