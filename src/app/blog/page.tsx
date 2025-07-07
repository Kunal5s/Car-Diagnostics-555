
import { ArticleGrid } from "@/components/article-grid";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getLiveArticles } from "@/lib/data";
import { Suspense } from "react";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";

export const metadata: Metadata = {
  title: 'Automotive Articles',
  description: 'Explore a fresh selection of our AI-generated articles. This page is automatically updated to bring you new content on car diagnostics, maintenance, and technology.',
};

// Revalidate this page every 20 minutes (1200 seconds)
export const revalidate = 1200;

async function LiveBlogContent() {
  const articles = await getLiveArticles(12); // Fetch 12 random live articles
  return <ArticleGrid articles={articles} />;
}

export default function BlogPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
        <div>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                  Automotive Articles
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                  Explore a fresh selection of our AI-generated articles. This page is automatically updated to bring you new content on car diagnostics, maintenance, and technology.
              </p>
          </div>
        </div>
        <Suspense fallback={<ArticleGridSkeleton count={12} />}>
            <LiveBlogContent />
        </Suspense>
    </div>
  );
}
