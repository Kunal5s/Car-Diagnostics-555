
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllTopics } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [
        {
          url: article.imageUrl || '',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
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
  
  // This removes the H1 from the markdown content, as it's already rendered in the header.
  const contentWithoutTitle = article.content.replace(/^# .*\n\n?/, '');

  // Check for database configuration errors specifically
  const isDbError = article.summary.includes("Database Configuration Error");
  if(isDbError) {
      return (
         <div className="container mx-auto max-w-4xl px-4 py-12">
            <Breadcrumbs items={breadcrumbItems} />
            <Card className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border-dashed">
                <CardContent className="p-6">
                    <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <h2 className="font-bold text-2xl text-foreground mb-2">Database Configuration Error</h2>
                    <p className="max-w-xl mx-auto">
                        This application requires a one-time database setup to cache articles. Please follow the instructions in the `README.md` file to run the required SQL script in your Supabase project.
                    </p>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <article>
            <Breadcrumbs items={breadcrumbItems} />
            {article.imageUrl && (
              <div className="relative mb-8 h-56 w-full overflow-hidden rounded-lg md:h-80">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={`${article.category} car`}
                />
              </div>
            )}
            <header className="mb-8">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
                {article.title}
            </h1>
            <p className="text-lg text-muted-foreground">{article.summary}</p>
            </header>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentWithoutTitle}</ReactMarkdown>
            </div>
        </article>
    </div>
  );
}
