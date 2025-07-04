import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: Article[] | null = null;

/**
 * Retrieves articles from the local cache file.
 * This function does not trigger generation; generation is handled on the admin panel.
 */
export async function getArticles(): Promise<Article[]> {
  // If articles are already cached in memory, return them.
  if (cachedArticles) {
    return cachedArticles;
  }

  try {
    // Ensure the cache directory exists
    await fs.mkdir(path.dirname(articlesFilePath), { recursive: true });
    // Check if the file exists, if not, create it with an empty array.
    await fs.access(articlesFilePath).catch(() => fs.writeFile(articlesFilePath, '[]', 'utf-8'));
    
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');

    if (fileContents && fileContents.trim() !== '[]' && fileContents.trim() !== '') {
      const articles: Article[] = JSON.parse(fileContents);
      cachedArticles = articles;
      return cachedArticles;
    }
  } catch (error) {
    // This might happen if the file is corrupted.
    console.error("Could not read articles.json cache. It might be corrupted.", error);
  }
  
  // Return empty array if cache is not found, empty, or corrupt.
  return [];
}
