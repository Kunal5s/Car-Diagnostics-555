import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateArticleAction } from '@/app/actions/generate-article';
import { generateImageAction } from '@/app/actions/generate-image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { MotionWrapper } from '@/components/motion-wrapper';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { params: { slug: string }, searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const title = searchParams?.title as string;
  const category = searchParams?.category as string;
  
  if (!title) {
    return {
      title: 'Article Not Found'
    }
  }
  return {
    title: `${title} - Car Diagnostics AI`,
    description: `An in-depth article on ${title}, covering ${category || 'automotive'} diagnostics and maintenance tips.`,
  }
}

export default async function ArticlePage({ params, searchParams }: { params: { slug: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const title = searchParams?.title as string;
  const category = searchParams?.category as string;

  if (!title || !category) {
    notFound();
  }
  
  const articleTopic = { title, category, slug: params.slug };

  // Fetch data on the server
  const [articleResult, imageResult] = await Promise.all([
    generateArticleAction(articleTopic.title),
    generateImageAction(`${articleTopic.title} ${articleTopic.category}`)
  ]);

  const { content: articleContent, error: articleError } = articleResult;
  const { imageUrl, error: imageError } = imageResult;
  
  const error = articleError || imageError;

  if (error || !articleContent) {
    return (
      <article className="container mx-auto max-w-4xl px-4 py-12">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: articleTopic.category, href: `/category/${articleTopic.category.toLowerCase()}` },
          { label: articleTopic.title },
        ]} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Article</AlertTitle>
          <AlertDescription>
            {error || 'The requested article could not be generated at this time. Please try again later.'}
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
      <MotionWrapper>
        <Breadcrumbs items={breadcrumbItems} />
      </MotionWrapper>
      <MotionWrapper delay={0.1}>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
            {articleTopic.title}
          </h1>
          <div className="text-sm text-muted-foreground">
            <Badge variant="secondary">{articleTopic.category}</Badge>
          </div>
        </header>
      </MotionWrapper>
      <MotionWrapper delay={0.2} className="relative mb-8 h-64 w-full md:h-96">
        <Image
          src={imageUrl || "https://placehold.co/600x400.png"}
          alt={articleTopic.title}
          fill
          className="rounded-lg object-cover"
          sizes="100vw"
          priority
          data-ai-hint={`${articleTopic.category.toLowerCase()}`}
        />
      </MotionWrapper>
      <MotionWrapper delay={0.3} className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{articleContent}</ReactMarkdown>
      </MotionWrapper>
    </article>
  );
}
