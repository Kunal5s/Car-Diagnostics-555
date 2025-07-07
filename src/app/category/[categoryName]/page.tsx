
import { ArticleGrid } from "@/components/article-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { categories, categoryDetails } from "@/lib/definitions";
import { notFound } from "next/navigation";
import type { Metadata } from 'next'
import { getLiveArticles } from "@/lib/data";
import { Suspense } from "react";
import { ArticleGridSkeleton } from "@/components/article-grid-skeleton";

export async function generateMetadata({ params }: { params: { categoryName: string } }): Promise<Metadata> {
  const categoryName = decodeURIComponent(params.categoryName);
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  if (!categories.map(c => c.toLowerCase()).includes(categoryName.toLowerCase())) {
    return {
      title: 'Category Not Found'
    }
  }

  return {
    title: `${formattedCategoryName} Articles`,
    description: `Browse articles about ${formattedCategoryName}. Find tips on car maintenance, diagnostics, and more.`,
  }
}

export async function generateStaticParams() {
  return categories
    .map((category) => ({
      categoryName: category.toLowerCase(),
    }));
}

// Revalidate this page every 20 minutes (1200 seconds)
export const revalidate = 1200;

async function LiveCategoryContent({ categoryName }: { categoryName: string }) {
    const articles = await getLiveArticles(4, categoryName);
    return <ArticleGrid articles={articles} />;
}

export default function CategoryPage({ 
  params
}: { 
  params: { categoryName: string }; 
}) {
  const categoryName = decodeURIComponent(params.categoryName);
  const categoryInfo = categoryDetails.find(c => c.name.toLowerCase() === categoryName);

  if (!categoryInfo) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryInfo.name },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
            {categoryInfo.name} Articles
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {categoryInfo.description}
          </p>
        </div>
      </div>
      <Suspense fallback={<ArticleGridSkeleton count={4} />}>
        <LiveCategoryContent categoryName={categoryInfo.name} />
      </Suspense>
    </div>
  );
}
