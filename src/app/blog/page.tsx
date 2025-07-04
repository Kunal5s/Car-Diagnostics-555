import { ArticleGrid } from "@/components/article-grid";
import { allArticleTopics } from "@/lib/definitions";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MotionWrapper } from "@/components/motion-wrapper";

export const metadata: Metadata = {
  title: 'All Articles - Car Diagnostics AI',
  description: 'Browse all our articles on car diagnostics, maintenance, and technology.',
};

export default function BlogPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];
  
  // We pass the topics without images. The ArticleCard component will fetch them.
  const articles = allArticleTopics;

  return (
    <div className="container mx-auto px-4 py-12">
        <MotionWrapper>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                  All Articles
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                  Explore our comprehensive library of automotive articles. Click any topic to generate the full content.
              </p>
          </div>
        </MotionWrapper>
        <ArticleGrid articles={articles} />
    </div>
  );
}
