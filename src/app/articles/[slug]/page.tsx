
import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleBySlug, getArticles } from '@/lib/data';
import { MotionWrapper } from '@/components/motion-wrapper';
import type { Metadata } from 'next';

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

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <MotionWrapper>
        <Breadcrumbs items={breadcrumbItems} />
      </MotionWrapper>
      <MotionWrapper delay={0.1}>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
            {article.title}
          </h1>
        </header>
      </MotionWrapper>
      <MotionWrapper delay={0.2} className="relative mb-8 h-64 w-full md:h-96">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="rounded-lg object-cover"
          sizes="100vw"
          priority
          data-ai-hint={article.category.toLowerCase()}
        />
      </MotionWrapper>
      <MotionWrapper delay={0.3} className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </MotionWrapper>
    </article>
  );
}

    