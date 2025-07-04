'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { allArticleTopics } from '@/lib/definitions';
import { generateArticleAction } from '@/app/actions/generate-article';
import { generateImageAction } from '@/app/actions/generate-image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function ArticleLoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <Skeleton className="h-12 w-3/4" />
      <div className="relative mb-8 h-64 w-full md:h-96">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-11/12" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <br />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  )
}

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [articleContent, setArticleContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articleTopic = useMemo(() => {
    if (!slug) return undefined;
    return allArticleTopics.find((a) => a.slug === slug);
  }, [slug]);

  useEffect(() => {
    if (!articleTopic) {
      // If the slug is present but we can't find a topic, it's a 404.
      if (slug) {
        notFound();
      }
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [articleResult, imageResult] = await Promise.all([
          generateArticleAction(articleTopic.title),
          generateImageAction(`${articleTopic.title} ${articleTopic.category}`)
        ]);

        if (articleResult.error) {
          setError(articleResult.error);
        } else {
          setArticleContent(articleResult.content);
        }
        
        setImageUrl(imageResult.imageUrl);

      } catch (e) {
        setError('An unexpected error occurred while fetching the article content.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [slug, articleTopic]);
  
  if (isLoading) {
    return <ArticleLoadingSkeleton />;
  }

  if (error || !articleTopic) {
    return (
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Article</AlertTitle>
          <AlertDescription>
            {error || 'The requested article could not be found.'}
          </AlertDescription>
        </Alert>
      </article>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: articleTopic.category, href: `/category/${articleTopic.category.toLowerCase()}` },
    { label: articleTopic.title },
  ];

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} />
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
          {articleTopic.title}
        </h1>
        <div className="text-sm text-muted-foreground">
          <Badge variant="secondary">{articleTopic.category}</Badge>
        </div>
      </header>
      <div className="relative mb-8 h-64 w-full md:h-96">
        <Image
          src={imageUrl || "https://placehold.co/600x400.png"}
          alt={articleTopic.title}
          fill
          className="rounded-lg object-cover"
          sizes="100vw"
          priority
        />
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleContent}</ReactMarkdown>
      </div>
    </article>
  );
}
