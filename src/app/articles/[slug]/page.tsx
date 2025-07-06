
import React from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllTopics } from '@/lib/data';
import { categoryDetails } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug:string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found'
    }
  }

  return {
    title: article.title,
    description: article.summary,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string }}) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: article.title },
  ];

  const categoryInfo = categoryDetails.find(c => c.name.toLowerCase() === article.category.toLowerCase());
  const Icon = categoryInfo?.icon;

  // Defensively handle missing content to prevent crashes
  const contentWithoutTitle = article.content ? article.content.replace(/^# .*\n\n?/, '') : '';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <article>
            <Breadcrumbs items={breadcrumbItems} />
             {categoryInfo && Icon && (
               <div className={cn("mb-8 flex h-56 w-full items-center justify-center rounded-lg", categoryInfo.color)}>
                  <Icon className={cn("h-28 w-28", categoryInfo.iconColor)} />
               </div>
            )}
            <header className="mb-8">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
                {article.title}
            </h1>
            <p className="text-lg text-muted-foreground">{article.summary}</p>
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                {contentWithoutTitle ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentWithoutTitle}</ReactMarkdown>
                ) : (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Content Not Available</AlertTitle>
                        <AlertDescription>
                        The full content for this article is not available at the moment. Please check back later.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </article>
    </div>
  );
}
