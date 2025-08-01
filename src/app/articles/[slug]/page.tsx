
import React from 'react';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/data';
import Image from 'next/image';
import { ShareButtons } from '@/components/share-buttons';

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
      images: [article.imageUrl],
    },
  }
}

// This makes sure pages are revalidated on-demand by the deploy hook, not on a timer.
export const revalidate = false;

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

  // This logic cleans up old articles that might have the title duplicated in the content.
  let processedContent = article.content.trim();
  const titleAsH1WithSpace = `# ${article.title}`;
  const titleAsH1NoSpace = `#${article.title}`;
  
  if (processedContent.toLowerCase().startsWith(titleAsH1WithSpace.toLowerCase())) {
      processedContent = processedContent.substring(titleAsH1WithSpace.length).trim();
  } else if (processedContent.toLowerCase().startsWith(titleAsH1NoSpace.toLowerCase())) {
      processedContent = processedContent.substring(titleAsH1NoSpace.length).trim();
  } else if (processedContent.toLowerCase().startsWith(article.title.toLowerCase())) {
      // Also check for the title without any markdown heading, just in case.
      processedContent = processedContent.substring(article.title.length).trim();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
        <article>
            <Breadcrumbs items={breadcrumbItems} />
            
            <header className="my-8">
              <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
                  {article.title}
              </h1>
            </header>

            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg md:h-96">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                  data-ai-hint={`${article.category.toLowerCase()} car`}
                />
            </div>
            
            <blockquote className="mb-8 border-l-4 border-primary bg-muted/50 p-4 text-lg italic">
              {article.summary}
            </blockquote>

            <ShareButtons title={article.title} />
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{processedContent}</ReactMarkdown>
            </div>
        </article>
    </div>
  );
}
