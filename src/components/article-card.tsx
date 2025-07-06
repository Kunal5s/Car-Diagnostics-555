
'use client';

import Link from "next/link";
import Image from "next/image";
import { type ArticleTopic, categoryDetails } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImageIcon } from "lucide-react";
import { motion } from 'framer-motion';

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

  const categoryInfo = categoryDetails.find(
    (c) => c.name.toLowerCase() === topic.category.toLowerCase()
  ) || null;

  return (
    <motion.div variants={cardVariants}>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <Link href={articleUrl} className="block relative h-48 w-full group bg-muted overflow-hidden rounded-t-lg">
             {topic.imageUrl ? (
                <Image
                  src={topic.imageUrl}
                  alt={topic.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={priority}
                />
             ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted rounded-t-lg">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
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
          <Button asChild variant="link" className="p-0">
            <Link href={articleUrl}>
              Read More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
