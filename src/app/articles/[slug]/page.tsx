
import React from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/data';
import Image from 'next/image';

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({
    slug: slug,
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
      images: article.imageUrl ? [article.imageUrl] : [],
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
  
  const contentWithoutTitle = article.content.replace(/^\s*#\s*[^\n]*\n*/, '');

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <article>
            <Breadcrumbs items={breadcrumbItems} />
            
            <header className="my-8">
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
                  {article.title}
              </h1>
              <p className="text-lg text-muted-foreground">{article.summary}</p>
            </header>

            {article.imageUrl && (
               <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentWithoutTitle}</ReactMarkdown>
            </div>
        </article>
    </div>
  );
}
