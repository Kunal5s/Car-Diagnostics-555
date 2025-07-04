import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let memoryCache: Article[] | null = null;

export async function getArticles(): Promise<Article[]> {
  // Serve from memory if possible for performance.
  // In a real-world scenario with frequent updates, you might use a more robust caching strategy.
  if (memoryCache && process.env.NODE_ENV === 'production') {
    return memoryCache;
  }
  
  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    const articles: Article[] = JSON.parse(fileContents);
    
    if (articles.length > 0) {
        memoryCache = articles;
    }
    return articles;
  } catch (error) {
    // This can happen if the file doesn't exist or is malformed.
    // Returning an empty array ensures the site doesn't crash and shows the appropriate loading/placeholder state.
    console.error("Could not read articles.json:", error);
    return [];
  }
}
