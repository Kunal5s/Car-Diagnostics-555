
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';
import { getImageForQuery } from './pexels';


let articleCache: FullArticle[] | null = null;
const pexelsCache = new Map<string, string>();


async function fetchAndCacheArticles(): Promise<FullArticle[]> {
  console.log("Fetching images from Pexels and caching articles...");

  // Use a temporary cache for the duration of this function call
  const tempPexelsCache = new Map<string, string>();

  const articlesWithImages: FullArticle[] = await Promise.all(
    (allArticlesData as FullArticle[]).map(async (article) => {
      const query = article.imageHint || article.title;
      let imageUrl = pexelsCache.get(query) || tempPexelsCache.get(query);

      if (!imageUrl) {
        try {
          const pexelsUrl = await getImageForQuery(query);
          if (pexelsUrl) {
            imageUrl = pexelsUrl;
            tempPexelsCache.set(query, imageUrl);
          } else {
            // Fallback to placeholder if Pexels returns nothing
            imageUrl = `https://placehold.co/720x405.png`;
          }
        } catch (error) {
          console.error(`Failed to fetch image for query "${query}":`, error);
          imageUrl = `https://placehold.co/720x405.png`; // Fallback on error
        }
      }

      return {
        ...article,
        imageUrl: imageUrl!,
      };
    })
  );
  
  // Update the main cache after all promises are resolved
  tempPexelsCache.forEach((value, key) => pexelsCache.set(key, value));
  
  articleCache = articlesWithImages;
  console.log("Finished fetching and caching images.");
  return articleCache;
}

export async function getAllArticles(): Promise<FullArticle[]> {
  if (articleCache) {
    return articleCache;
  }
  return await fetchAndCacheArticles();
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  const articles = await getAllArticles();
  return articles.map(({ id, title, category, slug, imageUrl, imageHint }) => ({
    id,
    title,
    category,
    slug,
    imageUrl,
    imageHint,
  }));
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  return topics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  const lowerCategoryName = categoryName.toLowerCase();
  
  return topics.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const articles = await getAllArticles();
  return articles.find(article => article.slug === slug);
}
