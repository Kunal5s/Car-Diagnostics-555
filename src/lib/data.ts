
import type { FullArticle, ArticleTopic } from './definitions';
import allArticlesData from './articles.json';
import { getImageFromPexels, getImageFromUnsplash } from './image-services';

// This is an in-memory cache to avoid fetching images repeatedly during the server's lifetime.
const imageCache = new Map<number, string>();
const FALLBACK_IMAGE = 'https://placehold.co/720x405.png';

// Function to enrich a single article with an image URL
async function enrichArticleWithImage(article: FullArticle): Promise<FullArticle> {
  if (imageCache.has(article.id)) {
    return { ...article, imageUrl: imageCache.get(article.id)! };
  }

  const query = article.imageHint ? `${article.imageHint} automotive` : `${article.title} car`;
  let imageUrl = FALLBACK_IMAGE;

  try {
    // 50% chance for Unsplash, 50% chance for Pexels
    if (Math.random() < 0.5) {
      console.log(`Fetching image from Unsplash for article ID: ${article.id}`);
      imageUrl = await getImageFromUnsplash(query);
    } else {
      console.log(`Fetching image from Pexels for article ID: ${article.id}`);
      imageUrl = await getImageFromPexels(query);
    }
  } catch (error) {
      console.error(`Failed to fetch any image for article ID: ${article.id}`, error);
      // imageUrl is already set to fallback
  }

  imageCache.set(article.id, imageUrl);
  return { ...article, imageUrl };
}


export async function getAllArticles(): Promise<FullArticle[]> {
  const articles: FullArticle[] = allArticlesData as FullArticle[];
  const enrichedArticles = await Promise.all(articles.map(enrichArticleWithImage));
  return enrichedArticles;
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
  const allArticles = await getAllArticles(); // This will now have fetched images
  return allArticles.map(({ id, title, category, slug, imageUrl, imageHint }) => ({
    id,
    title,
    category,
    slug,
    imageUrl,
    imageHint,
  }));
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
    // We take the first 6 articles from the static JSON for consistency on the homepage
  const homepageArticles = allArticlesData.slice(0, 6) as FullArticle[];
  const enrichedHomepageArticles = await Promise.all(homepageArticles.map(enrichArticleWithImage));
  return enrichedHomepageArticles;
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const allArticles = await getAllArticles();
  const lowerCategoryName = categoryName.toLowerCase();
  
  return allArticles.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
  const articles: FullArticle[] = allArticlesData as FullArticle[];
  const article = articles.find(article => article.slug === slug);
  if (!article) {
    return undefined;
  }
  return await enrichArticleWithImage(article);
}
