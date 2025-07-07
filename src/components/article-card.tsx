
import Link from "next/link";
import Image from "next/image";
import { type FullArticle, categoryDetails } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ArticleCardProps {
  article: FullArticle;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const articleUrl = `/articles/${article.slug}`;
  
  const categoryInfo = categoryDetails.find(c => c.name.toLowerCase() === article.category.toLowerCase());
  const Icon = categoryInfo ? categoryInfo.icon : FileQuestion;
  
  const hasImage = article.imageUrl && !article.imageUrl.includes('placehold.co');

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={articleUrl} className="block relative h-48 w-full group bg-muted overflow-hidden rounded-t-lg">
           {hasImage ? (
              <Image
                src={article.imageUrl!}
                alt={article.title}
                fill
                className="object-cover"
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
           ) : (
              <div className="flex items-center justify-center h-full w-full bg-secondary/40">
                <Icon className="h-16 w-16 text-muted-foreground/50" />
              </div>
           )}
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
         <div className="mb-2">
           <Badge variant="secondary" className="whitespace-nowrap">
              {article.category}
           </Badge>
         </div>
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight h-14">
          <Link href={articleUrl} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0 text-primary">
          <Link href={articleUrl} className="flex items-center">
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
