import articlesData from './articles.json';
import { categories, categoryDetails } from "./definitions";
import type { Article as ArticleTopic, FullArticle } from "./definitions";

const articles: FullArticle[] = articlesData as FullArticle[];

/**
 * Gets the current time slot of the day, from 0 to 7.
 * This is used to rotate content and simulate 8 refreshes per day (every 3 hours).
 * This corresponds to refreshes at 12, 3, 6, 9 (AM/PM).
 * @returns The current time slot (0-7).
 */
function getCurrentTimeSlot(): number {
    const hours = new Date().getUTCHours(); // Use UTC for global consistency
    // 8 slots in 24 hours means a new slot every 3 hours.
    return Math.floor(hours / 3);
}

/**
 * Rotates an array to simulate fresh content.
 * @param arr The array to rotate.
 * @param count The number of positions to rotate.
 * @returns The rotated array.
 */
function rotateArray<T>(arr: T[], count: number): T[] {
    if (arr.length === 0) return [];
    const rotation = count % arr.length;
    return [...arr.slice(rotation), ...arr.slice(0, rotation)];
}


export async function getArticles(): Promise<ArticleTopic[]> {
  const slot = getCurrentTimeSlot();
  // Rotate the entire list for the /blog page to show a different order.
  return rotateArray(articles, slot * 9); // Rotate by a larger amount for variety
}

export async function getHomepageArticles(): Promise<ArticleTopic[]> {
    const slot = getCurrentTimeSlot();
    const homepageArticles: ArticleTopic[] = [];
  
    // We want to feature one article from each category on the homepage.
    // The specific article from each category will change based on the time slot.
    categoryDetails.forEach(category => {
      const categoryArticles = articles.filter(a => a.category === category.name);
      if (categoryArticles.length > 0) {
        // Rotate the articles for this category based on the time slot
        const rotated = rotateArray(categoryArticles, slot);
        // Add the "freshest" article for this time slot to our homepage list
        homepageArticles.push(rotated[0]);
      }
    });
  
    // This will return one article per category, for a total of 9 on the homepage grid.
    return homepageArticles;
}

export async function getArticlesByCategory(categoryName: string): Promise<ArticleTopic[]> {
    const lowerCategoryName = categoryName.toLowerCase();
    
    if (lowerCategoryName === 'all') {
      return getArticles();
    }
    
    // For a specific category page, we always want to show all articles in that category.
    // The rotation just changes the display order for freshness.
    const categoryArticles = articles.filter(article => article.category.toLowerCase() === lowerCategoryName);
    const slot = getCurrentTimeSlot();
    return rotateArray(categoryArticles, slot);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    // Search the entire list regardless of time slot for direct link access
    return articles.find(article => article.slug === slug);
}
