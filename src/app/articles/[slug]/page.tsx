'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { allArticleTopics } from '@/lib/definitions';
import { generateArticleAction } from '@/app/actions/generate-article';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticlePageProps {
  params: { slug: string };
}

function ArticleLoadingSkeleton() {
  return (
    <div className="space-y-8">
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

export default function ArticlePage({ params }: ArticlePageProps) {
  const [articleContent, setArticleContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articleTopic = allArticleTopics.find((a) => a.slug === params.slug);

  useEffect(() => {
    if (!articleTopic) return;

    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateArticleAction(articleTopic.title);
        if (result.error) {
          setError(result.error);
        } else {
          setArticleContent(result.content);
        }
      } catch (e) {
        setError('An unexpected error occurred while fetching the article.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleTopic]);

  if (!articleTopic) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: articleTopic.category, href: `/category/${articleTopic.category.toLowerCase()}` },
    { label: articleTopic.title },
  ];

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {isLoading ? (
        <ArticleLoadingSkeleton />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Article</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
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
              src="https://placehold.co/600x400.png"
              alt={articleTopic.title}
              fill
              className="rounded-lg object-cover"
              sizes="100vw"
              priority
              data-ai-hint="car engine diagnostics"
            />
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleContent}</ReactMarkdown>
          </div>
        </>
      )}
    </article>
  );
}
