import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticles } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { Metadata } from 'next';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === params.slug);

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
          url: article.imageUrl,
          width: 600,
          height: 400,
          alt: article.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const articles = await getArticles();
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: article.category, href: `/category/${article.category.toLowerCase()}` },
    { label: article.title },
  ];

  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} />
      
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter text-primary md:text-5xl">
          {article.title}
        </h1>
        <div className="text-sm text-muted-foreground">
          <Badge variant="secondary">{article.category}</Badge>
        </div>
      </header>

      <div className="relative mb-8 h-64 w-full md:h-96">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="rounded-lg object-cover"
          sizes="100vw"
          priority
          data-ai-hint="car engine diagnostics"
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
