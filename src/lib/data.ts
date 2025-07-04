import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: Article[] | null = null;

/**
 * Retrieves articles from the local cache file.
 * This function does not trigger generation; generation is handled on-demand.
 */
export async function getArticles(): Promise<Article[]> {
  // If articles are already cached in memory, return them.
  if (cachedArticles) {
    return cachedArticles;
  }

  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    if (fileContents && fileContents.trim() !== '[]' && fileContents.trim() !== '') {
      const articles: Article[] = JSON.parse(fileContents);
      cachedArticles = articles;
      return cachedArticles;
    }
  } catch (error) {
    // This will happen if the file doesn't exist yet, which is fine.
    console.log("Could not read articles.json cache. It will be created on the first category visit.");
  }
  
  // Return empty array if cache is not found or empty.
  return [];
}
