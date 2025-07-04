import { ArticleGrid } from "@/components/article-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { allArticleTopics, categories, categoryDetails } from "@/lib/definitions";
import { notFound } from "next/navigation";
import type { Metadata } from 'next'
import { MotionWrapper } from "@/components/motion-wrapper";

export async function generateMetadata({ params }: { params: { categoryName: string } }): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  if (!categories.map(c => c.toLowerCase()).includes(categoryName.toLowerCase())) {
    return {
      title: 'Category Not Found'
    }
  }

  return {
    title: `${formattedCategoryName} Articles - Car Diagnostics AI`,
    description: `Browse articles about ${formattedCategoryName}. Find tips on car maintenance, diagnostics, and more.`,
  }
}

export async function generateStaticParams() {
  return categories
    .filter((c) => c !== "All")
    .map((category) => ({
      categoryName: category.toLowerCase(),
    }));
}

export default async function CategoryPage({ 
  params
}: { 
  params: { categoryName: string }; 
}) {
  const categoryName = decodeURIComponent(params.categoryName);
  const categoryInfo = categoryDetails.find(c => c.name.toLowerCase() === categoryName);

  if (!categoryInfo) {
    notFound();
  }
  
  const articlesForCategory = allArticleTopics.filter(
    (article) => article.category.toLowerCase() === categoryName.toLowerCase()
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryInfo.name },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <MotionWrapper>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
            {categoryInfo.name} Articles
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {categoryInfo.description}
          </p>
        </div>
      </MotionWrapper>
      {/* We pass articles without images; ArticleCard will fetch them on the client */}
      <ArticleGrid articles={articlesForCategory} />
    </div>
  );
}
