import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let memoryCache: Article[] | null = null;

export async function getArticles(): Promise<Article[]> {
  // Serve from memory if possible for performance
  if (memoryCache) {
    return memoryCache;
  }
  
  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    const articles = JSON.parse(fileContents);
    // Only cache if the file is not empty
    if (articles.length > 0) {
        memoryCache = articles;
    }
    return articles;
  } catch (error) {
    // This is expected if the file doesn't exist yet before generation has run.
    // The UI will show a loading/generation message.
    return [];
  }
}
