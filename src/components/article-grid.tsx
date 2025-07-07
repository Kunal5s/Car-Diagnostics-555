
import type { FullArticle } from '@/lib/definitions';
import { ArticleCard } from './article-card';
import { Card, CardContent } from './ui/card';
import { AlertCircle } from 'lucide-react';

interface ArticleGridProps {
  articles: FullArticle[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {

  if (!articles || articles.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground shadow-none border-dashed">
        <CardContent className="p-6">
          <AlertCircle className="mx-auto h-10 w-10 text-primary/50 mb-4" />
          <p className="font-semibold text-lg text-foreground mb-2">
            No Articles Available
          </p>
          <p className="max-w-md mx-auto">
            There was an issue generating live articles. This may be due to API limits or a temporary network issue. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <ArticleCard
          key={`${article.id}-${index}`}
          article={article}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
