import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MotionWrapper } from '@/components/motion-wrapper';
import type { Metadata } from 'next';
import { generateArticleAction } from '@/app/actions/generate-article';
import { generateImageAction } from '@/app/actions/generate-image';

function unslugify(slug: string): string {
  try {
    return Buffer.from(slug, 'base64url').toString('utf8');
  } catch (e) {
    console.error("Failed to decode slug:", e);
    return "Invalid Topic";
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const topicTitle = unslugify(params.slug);
  
  if (topicTitle === "Invalid Topic") {
    return {
      title: 'Article Not Found'
    }
  }

  return {
    title: `${topicTitle} - Car Diagnostics AI`,
    description: `An in-depth, AI-generated article on ${topicTitle}.`,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string }}) {
  const topicTitle = unslugify(params.slug);

  if (topicTitle === "Invalid Topic") {
    notFound();
  }
  
  // Generate content and image in parallel
  const [content, imageUrl] = await Promise.all([
    generateArticleAction(topicTitle),
    generateImageAction(topicTitle)
  ]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: topicTitle },
  ];

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <MotionWrapper>
        <Breadcrumbs items={breadcrumbItems} />
      </MotionWrapper>
      <MotionWrapper delay={0.1}>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
            {topicTitle}
          </h1>
        </header>
      </MotionWrapper>
      <MotionWrapper delay={0.2} className="relative mb-8 h-64 w-full md:h-96">
        <Image
          src={imageUrl}
          alt={topicTitle}
          fill
          className="rounded-lg object-cover"
          sizes="100vw"
          priority
          data-ai-hint={topicTitle.toLowerCase().split(' ').slice(0,2).join(' ')}
        />
      </MotionWrapper>
      <MotionWrapper delay={0.3} className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </MotionWrapper>
    </article>
  );
}
