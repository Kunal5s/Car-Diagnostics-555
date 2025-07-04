
import articlesData from './articles.json';
import type { Article } from './definitions';

const allArticles: Article[] = articlesData;

export async function getArticles(): Promise<Article[]> {
  return allArticles;
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  
  if (lowerCategoryName === 'all') {
    // Return a subset for the 'All' category page to keep it manageable
    return allArticles.slice(0, 18);
  }
  
  const filtered = allArticles.filter(article => article.category.toLowerCase() === lowerCategoryName);
  return filtered.slice(0, 9);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return allArticles.find(article => article.slug === slug);
}

    