import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MotionWrapper } from '@/components/motion-wrapper';
import type { Metadata } from 'next';
import { getArticleBySlug, getArticles } from '@/lib/data';


export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found'
    }
  }

  return {
    title: `${article.title} - Car Diagnostics AI`,
    description: `An in-depth, AI-generated article on ${article.title}.`,
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

  // Remove H1 from markdown content as it's already in the header
  const contentWithoutTitle = article.content.replace(/^# .*\n\n?/, '');

  return (
    <MotionWrapper className="container mx-auto max-w-4xl px-4 py-12">
        <article>
            <Breadcrumbs items={breadcrumbItems} />
            <header className="mb-8">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
                {article.title}
            </h1>
            </header>
            <div className="relative mb-8 h-64 w-full md:h-96">
                <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="rounded-lg object-cover"
                sizes="100vw"
                priority
                data-ai-hint={article.imageHint}
                />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentWithoutTitle}</ReactMarkdown>
            </div>
        </article>
    </MotionWrapper>
  );
}
