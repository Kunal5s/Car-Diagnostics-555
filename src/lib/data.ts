import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';
import articlesData from './articles.json';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: Article[] | null = null;

/**
 * Retrieves articles. It first tries to read from a local cache file.
 * If the file doesn't exist or is empty, it returns the initial placeholder data.
 * This function no longer triggers article generation to ensure server stability.
 * Generation must be triggered manually from the admin panel.
 */
export async function getArticles(): Promise<Article[]> {
  // If articles are already cached in memory, return them.
  if (cachedArticles) {
    return cachedArticles;
  }

  try {
    // Try to read the articles from the file system.
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    if (fileContents) {
      const articles: Article[] = JSON.parse(fileContents);
      // Check if the file has been populated with real content.
      if (articles.length > 0 && !articles[0].summary.includes('placeholder')) {
        console.log(`Loaded ${articles.length} generated articles from file.`);
        cachedArticles = articles;
        return cachedArticles;
      }
    }
  } catch (error) {
    // This might happen if the file doesn't exist yet on a fresh checkout.
    console.log("Could not read articles.json, will fall back to initial placeholder data.");
  }
  
  // Fallback to the initial imported placeholder data if the file is missing or contains placeholders.
  console.log("Using initial placeholder article data.");
  cachedArticles = articlesData as Article[];
  return cachedArticles;
}
