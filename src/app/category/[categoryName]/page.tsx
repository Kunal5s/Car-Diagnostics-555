import { ArticleGrid } from "@/components/article-grid";
import { Search } from "@/components/search";
import { ensureCategoryArticles } from "@/ai/flows/ensure-articles";
import { categories } from "@/lib/definitions";
import { notFound } from "next/navigation";
import type { Metadata } from 'next'

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
  params, 
  searchParams 
}: { 
  params: { categoryName: string }; 
  searchParams?: { q?: string };
}) {
  const categoryName = decodeURIComponent(params.categoryName);
  const searchTerm = searchParams?.q || "";

  if (!categories.map(c => c.toLowerCase()).includes(categoryName.toLowerCase())) {
    notFound();
  }
  
  // This is the core change. This function will generate articles if they don't exist in the cache.
  const articlesForCategory = await ensureCategoryArticles(categoryName);

  const filteredArticles = articlesForCategory.filter(
    (article) => article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="container mx-auto px-4">
       <section className="py-12 text-center md:py-20">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-6xl">
          {formattedCategoryName}
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Articles in the {formattedCategoryName} category.
        </p>
        <div className="mx-auto max-w-2xl">
          <Search />
        </div>
      </section>

      <section className="py-12">
        <ArticleGrid articles={filteredArticles} />
      </section>
    </div>
  );
}
