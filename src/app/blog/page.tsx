import { ArticleGrid } from "@/components/article-grid";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MotionWrapper } from "@/components/motion-wrapper";
import { generateTopicsAction } from '@/app/actions/generate-topics';
import { generateImageAction } from '@/app/actions/generate-image';

export const metadata: Metadata = {
  title: 'All Articles - Car Diagnostics AI',
  description: 'Browse all our articles on car diagnostics, maintenance, and technology.',
};

export default async function BlogPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];
  
  const topics = await generateTopicsAction("All Automotive Categories", 18);

  const allArticles = await Promise.all(
    topics.map(async (topic) => {
      const imageUrl = await generateImageAction(`${topic.title} ${topic.category}`);
      return { ...topic, imageUrl };
    })
  );

  return (
    <div className="container mx-auto px-4 py-12">
        <MotionWrapper>
          <Breadcrumbs items={breadcrumbItems} />
          <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
                  All Articles
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                  Explore our comprehensive library of automotive articles, generated in real-time by AI.
              </p>
          </div>
        </MotionWrapper>
        <ArticleGrid articles={allArticles} />
    </div>
  );
}
