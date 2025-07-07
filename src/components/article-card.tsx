
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
import { ArrowRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface ArticleCardProps {
  topic: ArticleTopic;
  priority?: boolean;
}

export function ArticleCard({ topic, priority = false }: ArticleCardProps) {
  const articleUrl = `/articles/${topic.slug}`;
  
  // The "pending" state is no longer possible for displayed articles,
  // so the 'isPending' check has been removed for a cleaner component.

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
              // This skeleton is a fallback for the rare case an image URL is missing,
              // but this should not happen with the new pre-generated data model.
              <div className="flex items-center justify-center h-full w-full bg-secondary/40">
                  <Skeleton className="h-full w-full" />
              </div>
           )}
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
         <div className="mb-2">
           <Badge variant="secondary" className="whitespace-nowrap">
              {topic.category}
           </Badge>
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
