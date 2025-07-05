import articlesData from './articles.json';
import type { FullArticle } from "./definitions";

// The full, static library of all 54 articles.
const articles: FullArticle[] = articlesData as FullArticle[];

/**
 * Gets the current time slot of the day.
 * The day is divided into 8 slots of 3 hours each.
 * This ensures content rotates at 12, 3, 6, and 9 (AM/PM), UTC.
 * @returns The current time slot (0-7).
 */
function getCurrentTimeSlot(): number {
    const hours = new Date().getUTCHours();
    return Math.floor(hours / 3);
}

/**
 * Rotates an array to simulate fresh content based on the current time slot.
 * @param arr The array to rotate.
 * @returns The rotated array.
 */
function rotateArrayForFreshness<T>(arr: T[]): T[] {
    if (arr.length === 0) return [];
    const slot = getCurrentTimeSlot();
    const rotation = slot % arr.length;
    return [...arr.slice(rotation), ...arr.slice(0, rotation)];
}


/**
 * Returns all articles, with the order rotated for the main blog page.
 */
export async function getArticles(): Promise<FullArticle[]> {
  // Rotate by a larger amount for more variety on the main blog page
  const slot = getCurrentTimeSlot();
  const rotation = (slot * 9) % articles.length; 
  return [...articles.slice(rotation), ...articles.slice(0, rotation)];
}

/**
 * Returns 6 unique articles for the homepage, one from each of the first 6 categories.
 * The selection is rotated throughout the day.
 */
export async function getHomepageArticles(): Promise<FullArticle[]> {
    const articlesByCategory: Record<string, FullArticle[]> = {};
    articles.forEach(article => {
        if (!articlesByCategory[article.category]) {
            articlesByCategory[article.category] = [];
        }
        articlesByCategory[article.category].push(article);
    });

    const homepageArticles: FullArticle[] = [];
    // Take one article from each category, rotating the selection
    for (const category in articlesByCategory) {
        homepageArticles.push(rotateArrayForFreshness(articlesByCategory[category])[0]);
    }
    
    return homepageArticles.slice(0, 6);
}

/**
 * Gets all articles for a given category, with the order rotated for freshness.
 * @param categoryName The name of the category.
 */
export async function getArticlesByCategory(categoryName: string): Promise<FullArticle[]> {
    const lowerCategoryName = categoryName.toLowerCase();
    
    if (lowerCategoryName === 'all') {
      return getArticles();
    }
    
    const categoryArticles = articles.filter(article => article.category.toLowerCase() === lowerCategoryName);
    return rotateArrayForFreshness(categoryArticles);
}
  
/**
 * Finds a single article by its slug from the static library.
 * @param slug The slug of the article to find.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    return articles.find(article => article.slug === slug);
}
