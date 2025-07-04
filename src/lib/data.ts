import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');

// In-memory cache to prevent constant file reads after initial load
let memoryCache: Article[] | null = null;

export async function getArticles(): Promise<Article[]> {
  // If we have articles in memory, serve them immediately.
  if (memoryCache) {
    return memoryCache;
  }
  
  try {
    // Check if the file exists first. If not, return an empty array.
    await fs.access(articlesFilePath);
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    
    // If the file is empty or just whitespace, return an empty array.
    if (!fileContents.trim()) {
      return [];
    }

    const articles: Article[] = JSON.parse(fileContents);
    
    // Cache the articles in memory for subsequent requests.
    memoryCache = articles; 
    return articles; 
  } catch (error) {
    // This catches errors like the file not existing or being corrupt JSON.
    // In these cases, we'll return an empty array, which will show the user the "No Articles Found" state.
    console.warn("Could not read articles.json, or it is empty/invalid. This is normal before first generation.", error);
    return [];
  }
}
