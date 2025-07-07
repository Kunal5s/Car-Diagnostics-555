
'use server';

import type { FullArticle } from './definitions';
import { articles as initialArticles } from './articles';
import { slugify } from './utils';

// This new data layer uses a static, pre-generated JSON file.
// It's fast, reliable, and removes the need for live fetches to GitHub.
// The Vercel Cron Job can be used in a separate process to update this `articles.json` file in your git repo.

let articles: FullArticle[] = [];

// A simple in-memory cache to avoid reading the file on every request.
function getCachedArticles(): FullArticle[] {
  if (articles.length === 0) {
    // Add slugs to the articles if they don't have them
    articles = initialArticles.map(article => ({
      ...article,
      slug: slugify(`${article.title}-${article.id}`)
    }));
  }
  return articles;
}


/**
 * Provides a list of all article slugs for static page generation.
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  const allArticles = getCachedArticles();
  return allArticles.map((article) => article.slug);
}

/**
 * Fetches a single article's full content by its slug.
 * @param slug The slug of the article to retrieve.
 * @returns A FullArticle object or null if not found.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const allArticles = getCachedArticles();
    return allArticles.find(article => article.slug === slug) || null;
}

/**
 * Fetches all articles.
 * @returns A promise that resolves to an array of FullArticle objects.
 */
export async function getAllArticles(): Promise<FullArticle[]> {
    const allArticles = getCachedArticles();
    // Sort by ID descending to show newest first
    return allArticles.sort((a, b) => b.id - a.id);
}

/**
 * Gets a specified number of the most recent articles.
 * @param count The number of trending articles to return.
 * @returns An array of FullArticle objects.
 */
export async function getTrendingArticles(count: number): Promise<FullArticle[]> {
    const allArticles = await getAllArticles(); // This already sorts by newest
    return allArticles.slice(0, count);
}

/**
 * Gets all articles for a specific category.
 * @param category The category to filter by.
 * @returns An array of FullArticle objects.
 */
export async function getArticlesByCategory(category: string): Promise<FullArticle[]> {
    const allArticles = await getAllArticles(); // This already sorts by newest
    return allArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}
