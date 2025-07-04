import { ArticleGrid } from "@/components/article-grid";
import { CategoryNav } from "@/components/category-nav";
import { Search } from "@/components/search";
import { articles, categories } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Diagnostics AI - Your Vehicle Health Partner",
  description: "Explore articles on engine health, sensors, OBD2, maintenance tips, and the latest EV trends. Your go-to resource for car diagnostics.",
};

export default function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const searchTerm = searchParams?.q || "";
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4">
      <section className="py-12 text-center md:py-20">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary md:text-6xl">
          CarDiagnosticsBrainAI
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Your intelligent assistant for vehicle diagnostics and maintenance.
        </p>
        <div className="mx-auto max-w-2xl">
          <Search />
        </div>
      </section>

      <CategoryNav categories={categories} />
      
      <ArticleGrid articles={filteredArticles} />
    </div>
  );
}
