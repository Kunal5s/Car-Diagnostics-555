
'use client';

import Link from "next/link";
import { type ArticleTopic, categoryDetails } from "@/lib/definitions";
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
import { cn } from "@/lib/utils";

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
  const categoryInfo = categoryDetails.find(c => c.name.toLowerCase() === topic.category.toLowerCase());
  const Icon = categoryInfo?.icon;

  return (
    <motion.div variants={cardVariants}>
      <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <CardHeader className="p-0">
          <Link href={articleUrl} className="block relative h-48 w-full group bg-muted">
              {categoryInfo && Icon && (
                <div className={cn("flex h-full items-center justify-center rounded-t-lg", categoryInfo.color)}>
                  <Icon className={cn("h-20 w-20 transition-transform duration-300 group-hover:scale-110", categoryInfo.iconColor)} />
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
