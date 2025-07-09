
import { ArticleGrid } from "@/components/article-grid";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllArticles } from "@/lib/data";
import { Suspense } from "react";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";
import { Search } from "@/components/search";

export const metadata: Metadata = {
  title: 'Automotive Articles',
  description: 'Explore our complete library of AI-generated articles on car diagnostics, maintenance, and technology.',
};

async function AllArticlesContent({ query }: { query?: string }) {
  const articles = await getAllArticles(query);
  return <ArticleGrid articles={articles} />;
}

export default function BlogPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
}) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];

  const query = searchParams?.q || '';

  return (
    <div className="container mx-auto px-4 py-12">
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                  All Automotive Articles
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                 Explore our complete library of AI-generated articles, regularly updated with new content on car diagnostics, maintenance, and technology.
              </p>
          </div>
          <div className="mb-12 max-w-2xl mx-auto">
            <Search />
          </div>
        </div>
        <Suspense key={query} fallback={<ArticleGridSkeleton count={12} />}>
            <AllArticlesContent query={query} />
        </Suspense>
    </div>
  );
}
