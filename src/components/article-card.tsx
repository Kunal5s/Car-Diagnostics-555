'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { ArticleTopic } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { generateImageAction } from '@/app/actions/generate-image';

interface ArticleCardProps {
  article: ArticleTopic;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchImage() {
      const { imageUrl: url } = await generateImageAction(`${article.title} ${article.category}`);
      if (isMounted) {
        setImageUrl(url);
      }
    }
    fetchImage();
    return () => { isMounted = false; };
  }, [article.title, article.category]);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/articles/${article.slug}`} className="block relative h-48 w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={article.category.toLowerCase()}
              />
            ) : (
                <Skeleton className="h-full w-full" />
            )}
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <Badge variant="secondary" className="mb-2">
          {article.category}
        </Badge>
        <h3 className="mb-2 line-clamp-3 font-semibold leading-tight">
          <Link href={`/articles/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="link" className="p-0">
          <Link href={`/articles/${article.slug}`}>
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
