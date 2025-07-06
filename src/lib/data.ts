
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';

// Type assertion
const articles: FullArticle[] = allArticlesData as FullArticle[];

// In-memory cache to make subsequent requests faster within the server's lifecycle.
const articleCache = new Map<string, FullArticle>();
const topicsCache: ArticleTopic[] = [];

function populateCaches() {
  if (articleCache.size === 0) {
    articles.forEach(article => {
      // Create a slug from the title and id, just in case titles are not unique.
      const slug = `${article.slug}`;
      articleCache.set(slug, {...article, slug: slug });
      topicsCache.push({
        id: article.id,
        title: article.title,
        category: article.category,
        slug: slug,
      });
    });
  }
}

// Initial population of the cache
populateCaches();

export async function getAllArticles(): Promise<FullArticle[]> {
  return Array.from(articleCache.values());
}

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
  return articleCache.get(slug);
}
