
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';
import { getPexelsImage } from './pexels';
import { getUnsplashImage } from './unsplash';
import { getPollinationsImage } from './pollinations';


let articleCache: FullArticle[] | null = null;
const imageCache = new Map<string, string>();


async function fetchAndCacheArticles(): Promise<FullArticle[]> {
  console.log("Fetching images from various sources and caching articles...");

  const articlesWithImages: FullArticle[] = await Promise.all(
    (allArticlesData as FullArticle[]).map(async (article) => {
      const query = article.imageHint || article.title;
      let imageUrl = imageCache.get(query);

      if (!imageUrl) {
        try {
          const random = Math.random();
          let fetchedUrl: string | null = null;
          
          if (random < 0.5) { // 50% chance for Unsplash
            console.log(`- Image source: Unsplash for query "${query}"`);
            fetchedUrl = await getUnsplashImage(query);
          } else if (random < 0.8) { // 30% chance for Pexels
            console.log(`- Image source: Pexels for query "${query}"`);
            fetchedUrl = await getPexelsImage(query);
          } else { // 20% chance for Pollinations.ai
            console.log(`- Image source: Pollinations.ai for query "${query}"`);
            fetchedUrl = await getPollinationsImage(query);
          }

          if (fetchedUrl) {
            imageUrl = fetchedUrl;
            imageCache.set(query, imageUrl);
          } else {
            console.warn(`All image sources failed for query "${query}". Falling back to placeholder.`);
            // Fallback to placeholder if all sources fail
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
