import { type FullArticle } from "@/lib/definitions";
import { ArticleCard } from "./article-card";
import { Card, CardContent } from "./ui/card";
import { AlertCircle } from "lucide-react";
import { MotionGrid } from "./motion-grid";
import Link from "next/link";
import { Button } from "./ui/button";

interface ArticleGridProps {
  articles: FullArticle[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (!articles || articles.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive mb-4" />
            <p className="font-semibold text-lg text-foreground mb-2">No Articles Found</p>
            <p className="max-w-md mx-auto">
              Content could not be loaded. This may be due to missing API keys or an error during generation. Please check the setup instructions or try again later.
            </p>
            <Button asChild className="mt-6">
                <Link href="/settings">View Setup Instructions</Link>
            </Button>
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
