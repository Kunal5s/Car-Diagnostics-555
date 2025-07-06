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

  return (
    <motion.div variants={cardVariants}>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <Link href={articleUrl} className="block relative h-48 w-full group bg-muted overflow-hidden rounded-t-lg">
            <Image
              src={topic.imageUrl || 'https://placehold.co/1200x600.png'}
              alt={topic.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              data-ai-hint={`${topic.category} car`}
            />
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
