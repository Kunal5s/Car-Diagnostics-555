
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';
import { getImageForQuery } from './image-services';

const articles: Omit<FullArticle, 'imageUrl'>[] = allArticlesData as Omit<FullArticle, 'imageUrl'>[];

// In-memory cache to avoid repeated API calls for the same article during a server's lifetime
const imageCache = new Map<number, string>();

async function enrichArticleWithImage<T extends { id: number; title: string; category: string; slug: string; }>(article: T): Promise<T & { imageUrl: string; imageHint?: string }> {
  if (imageCache.has(article.id)) {
    return { ...article, imageUrl: imageCache.get(article.id)! };
  }

  // Use both title and category for a more specific image query
  const query = `${article.title} ${article.category}`;
  const imageUrl = await getImageForQuery(query);
  imageCache.set(article.id, imageUrl);

  const imageHint = article.title.split(' ').slice(0, 2).join(' ');

  return { ...article, imageUrl, imageHint };
}


export async function getAllArticles(): Promise<FullArticle[]> {
  const enrichedArticles = await Promise.all(
    articles.map(article => enrichArticleWithImage(article as FullArticle))
  );
  return enrichedArticles;
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  const enrichedTopics = await Promise.all(
    articles.map(async (article) => {
      return await enrichArticleWithImage(article as ArticleTopic);
    })
  );
  return enrichedTopics;
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const homepageArticles = articles.slice(0, 6);
  const enrichedTopics = await Promise.all(
     homepageArticles.map(async (article) => {
      return await enrichArticleWithImage(article as ArticleTopic);
    })
  );
  return enrichedTopics;
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  const filteredArticles = articles.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
  
  const enrichedTopics = await Promise.all(
     filteredArticles.map(async (article) => {
      return await enrichArticleWithImage(article as ArticleTopic);
    })
  );

  return enrichedTopics;
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const article = articles.find(article => article.slug === slug);
  if (!article) {
    return undefined;
  }
  return await enrichArticleWithImage(article as FullArticle);
}
