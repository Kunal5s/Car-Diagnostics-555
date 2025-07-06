
import articlesData from './articles.json';
import type { FullArticle, ArticleTopic } from './definitions';
import { slugify } from './utils';

// The full article data is now imported directly from the JSON file.
const allArticles: FullArticle[] = articlesData as FullArticle[];

// A cache is created on server startup to hold all articles for fast lookups.
// This avoids reading the file on every request.
const articleCache = new Map<string, FullArticle>(allArticles.map(a => [a.slug, a]));

// A separate cache for just the topics (for category pages, etc.)
const topicsCache: ArticleTopic[] = allArticles.map(article => ({
    id: article.id,
    title: article.title,
    category: article.category,
    slug: article.slug,
}));

export async function getAllTopics(): Promise<ArticleTopic[]> {
  return topicsCache;
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  // The first 6 articles are considered "trending" for the homepage.
  return topicsCache.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  return topicsCache.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    // The logic is now extremely simple and reliable: just get the article from the cache.
    // No more fallible, external API calls.
    return articleCache.get(slug);
}

// This function is used by the sitemap. It returns all possible article topics.
export async function getAllArticles(): Promise<ArticleTopic[]> {
    return topicsCache;
}

