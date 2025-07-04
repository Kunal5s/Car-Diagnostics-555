import { ArticleGrid } from "@/components/article-grid";
import { getArticles } from "@/lib/data";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: 'All Articles - Car Diagnostics AI',
  description: 'Browse all our articles on car diagnostics, maintenance, and technology.',
};

export default async function BlogPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];
  
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-12">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                All Articles
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                Explore our comprehensive library of automotive articles.
            </p>
        </div>
        <ArticleGrid articles={articles} />
    </div>
  );
}
