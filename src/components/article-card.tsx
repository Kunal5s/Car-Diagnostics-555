import Image from "next/image";
import Link from "next/link";
import { type FullArticle } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: FullArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const articleUrl = `/articles/${article.slug}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={articleUrl} className="block relative h-48 w-full">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={article.imageHint}
            />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <Badge variant="secondary" className="mb-2">
          {article.category}
        </Badge>
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight">
          <Link href={articleUrl} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.summary}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0">
          <Link href={articleUrl}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
