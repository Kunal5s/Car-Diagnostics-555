import { ArticleGrid } from "@/components/article-grid";
import { CategoryCard } from "@/components/category-card";
import { CategoryNav } from "@/components/category-nav";
import { articles, categories, categoryDetails } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Automotive Categories - Car Diagnostics AI",
  description: "Discover AI-curated content across all aspects of automotive diagnostics and technology. Browse categories like Engine, Sensors, OBD2, and more.",
};

export default function HomePage() {
  const trendingArticles = articles.slice(0, 6);

  return (
    <>
      <CategoryNav categories={categories} />
      <div className="container mx-auto px-4">
        <section className="py-12 text-center md:py-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary lg:text-5xl">
            Explore Automotive <span className="text-accent">Categories</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            Discover AI-curated content across all aspects of automotive diagnostics and technology.
          </p>
        </section>

        <section className="pb-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {categoryDetails.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        </section>

        <section className="border-t py-12">
          <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-primary lg:text-4xl">
            Trending Articles
          </h2>
          <ArticleGrid articles={trendingArticles} />
        </section>
      </div>
    </>
  );
}
