
import { Article } from "@/lib/definitions";
import { ArticleCard } from "./article-card";
import { Card, CardContent } from "./ui/card";
import { AlertCircle } from "lucide-react";
import { MotionGrid } from "./motion-grid";

interface ArticleGridProps {
  articles: Article[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
            <AlertCircle className="mx-auto h-10 w-10 text-primary mb-4" />
            <p className="font-semibold text-lg text-foreground mb-2">No Articles Found</p>
            <p>There are no articles available for this category yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <MotionGrid className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </MotionGrid>
  );
}

    