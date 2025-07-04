import { Article } from "@/lib/data";
import { ArticleCard } from "./article-card";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

interface ArticleGridProps {
  articles: Article[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary mb-4" />
            <p className="font-semibold text-lg text-foreground mb-2">Content is being generated...</p>
            <p>This is a one-time process for the entire site and may take up to 10 minutes.</p>
            <p>This page will update automatically once content is available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
