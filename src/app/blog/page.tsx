
import { ArticleGrid } from "@/components/article-grid";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getAllArticles } from "@/lib/data";
import { Suspense } from "react";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";

export const metadata: Metadata = {
  title: 'Automotive Articles',
  description: 'Explore our complete library of AI-generated articles on car diagnostics, maintenance, and technology.',
};

async function AllArticlesContent() {
  // This now just reads from the filesystem, it does not generate articles.
  const articles = await getAllArticles();
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
                  All Automotive Articles
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                 Explore our complete library of AI-generated articles, regularly updated with new content on car diagnostics, maintenance, and technology.
              </p>
          </div>
        </div>
        <Suspense fallback={<ArticleGridSkeleton count={12} />}>
            <AllArticlesContent />
        </Suspense>
    </div>
  );
}
