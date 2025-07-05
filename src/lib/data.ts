import articlesData from './articles.json';
import type { FullArticle } from './definitions';

// The articles are now typed and imported directly from the JSON file.
const allArticles: FullArticle[] = articlesData as FullArticle[];

/**
 * Fetches all articles from the static JSON file.
 * This is now a simple and reliable function.
 * @returns A promise that resolves to an array of all articles.
 */
export async function getArticles(): Promise<FullArticle[]> {
  // Simply return the imported articles. No more complex logic.
  return allArticles;
}

/**
 * Fetches the first 6 articles for the homepage.
 * @returns A promise that resolves to an array of homepage articles.
 */
export async function getHomepageArticles(): Promise<FullArticle[]> {
  const articles = await getArticles();
  return articles.slice(0, 6);
}

/**
 * Fetches articles filtered by a specific category.
 * @param categoryName The name of the category to filter by.
 * @returns A promise that resolves to an array of articles in that category.
 */
export async function getArticlesByCategory(categoryName: string): Promise<FullArticle[]> {
  const articles = await getArticles();
  const lowerCategoryName = categoryName.toLowerCase();
  
  if (lowerCategoryName === 'all') {
    return articles;
  }
  
  return articles.filter(article => article.category.toLowerCase() === lowerCategoryName);
}
  
/**
 * Fetches a single article by its slug.
 * @param slug The slug of the article to find.
 * @returns A promise that resolves to the article if found, otherwise undefined.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const articles = await getArticles();
  return articles.find(article => article.slug === slug);
}
