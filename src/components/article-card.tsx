
'use client';

import Link from "next/link";
import Image from "next/image";
import { type ArticleTopic } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Circle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ArticleCardProps {
  topic: ArticleTopic;
  priority?: boolean;
}

export function ArticleCard({ topic, priority = false }: ArticleCardProps) {
  const articleUrl = `/articles/${topic.slug}`;
  const isPending = topic.status === 'pending';

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={articleUrl} className="block relative h-48 w-full group bg-muted overflow-hidden rounded-t-lg">
           {topic.imageUrl ? (
              <Image
                src={topic.imageUrl}
                alt={topic.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
           ) : (
              <div className="flex items-center justify-center h-full w-full bg-secondary/40">
                  <Skeleton className="h-full w-full" />
              </div>
           )}
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
         <div className="flex justify-between items-start mb-2">
           <Badge variant="secondary" className="whitespace-nowrap">
              {topic.category}
           </Badge>
           {isPending && (
            <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Circle className="h-3 w-3 fill-current" />
              <span>Pending</span>
            </div>
           )}
         </div>
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight h-14">
          <Link href={articleUrl} className="hover:text-primary">
            {topic.title}
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
