import { ArticleGrid } from "@/components/article-grid";
import { allArticleTopics, type ArticleTopic } from "@/lib/definitions";
import type { Metadata } from 'next';
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MotionWrapper } from "@/components/motion-wrapper";
import { generateImageAction } from "@/app/actions/generate-image";

export const metadata: Metadata = {
  title: 'All Articles - Car Diagnostics AI',
  description: 'Browse all our articles on car diagnostics, maintenance, and technology.',
};

interface ArticleTopicWithImage extends ArticleTopic {
  imageUrl: string;
}

export default async function BlogPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];
  
  // Fetch all images in parallel on the server
  const articlesWithImages: ArticleTopicWithImage[] = await Promise.all(
    allArticleTopics.map(async (article) => {
      const { imageUrl } = await generateImageAction(`${article.title} ${article.category}`);
      return { ...article, imageUrl };
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
                  Explore our comprehensive library of automotive articles. Click any topic to generate the full content.
              </p>
          </div>
        </MotionWrapper>
        <ArticleGrid articles={articlesWithImages} />
    </div>
  );
}
