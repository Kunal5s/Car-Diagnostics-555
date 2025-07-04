import articlesData from './articles.json';
import { categories } from "./definitions";
import type { Article } from "./definitions";

// The full type for an article, including the content.
// This is now safe to use because we are not making network requests.
interface FullArticle extends Article {
    content: string;
}

const articles: FullArticle[] = articlesData as FullArticle[];

/**
 * Gets the current time slot of the day, from 0 to 4.
 * This is used to rotate content and simulate 5 refreshes per day.
 * @returns The current time slot (0-4).
 */
function getCurrentTimeSlot(): number {
    const hours = new Date().getUTCHours(); // Use UTC for global consistency
    return Math.floor(hours / (24 / 5)); // 24 hours / 5 slots
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


export async function getArticles(): Promise<Article[]> {
  const slot = getCurrentTimeSlot();
  // Rotate the entire list for the /blog page to show a different order.
  return rotateArray(articles, slot * 6); // Rotate by a larger amount for variety
}

export async function getHomepageArticles(): Promise<Article[]> {
    const slot = getCurrentTimeSlot();
    const homepageArticles: Article[] = [];
  
    // Filter non-"All" categories
    const articleCategories = categories.filter(c => c !== "All");
  
    articleCategories.forEach(category => {
      // Get all articles for the current category
      const categoryArticles = articles.filter(a => a.category === category);
      
      if (categoryArticles.length > 0) {
        // Rotate the articles for this category based on the time slot
        const rotated = rotateArray(categoryArticles, slot);
        // Add the "freshest" article for this time slot to our homepage list
        homepageArticles.push(rotated[0]);
      }
    });
  
    return homepageArticles;
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
    const lowerCategoryName = categoryName.toLowerCase();
    
    if (lowerCategoryName === 'all') {
      return getArticles(); // Return the time-rotated list for 'All'
    }
    
    const categoryArticles = articles.filter(article => article.category.toLowerCase() === lowerCategoryName);
    
    // For a specific category, rotate its articles based on the time slot to keep it fresh
    const slot = getCurrentTimeSlot();
    return rotateArray(categoryArticles, slot);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    // Search the entire list regardless of time slot for direct link access
    return articles.find(article => article.slug === slug);
}
