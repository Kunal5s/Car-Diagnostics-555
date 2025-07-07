
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
import { ArrowRight, ImageOff } from "lucide-react";
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ArticleCardProps {
  topic: ArticleTopic;
  priority?: boolean;
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
};

export function ArticleCard({ topic, priority = false }: ArticleCardProps) {
  const articleUrl = `/articles/${topic.slug}`;
  const [imageError, setImageError] = useState(false);

  const hasImage = topic.imageUrl && !imageError;

  return (
    <motion.div variants={cardVariants}>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <Link href={articleUrl} className="block relative h-48 w-full group bg-muted overflow-hidden rounded-t-lg">
             {hasImage ? (
                <Image
                  src={topic.imageUrl!}
                  alt={topic.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={priority}
                  onError={() => setImageError(true)}
                />
             ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <ImageOff className="h-10 w-10 text-muted-foreground/50" />
                </div>
             )}
          </Link>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <Badge variant="secondary" className="mb-2">
            {topic.category}
          </Badge>
          <h3 className="mb-2 line-clamp-2 font-semibold leading-tight h-14">
            <Link href={articleUrl} className="hover:text-primary">
              {topic.title}
            </Link>
          </h3>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Button asChild variant="link" className="p-0 text-primary">
            <Link href={articleUrl} className="flex items-center">
              {topic.status === 'ready' ? (
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-green-500" title="Ready to read"></span>
              ) : (
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse" title="Generation in progress"></span>
              )}
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
