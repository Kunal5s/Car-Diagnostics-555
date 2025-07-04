import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');

export async function getArticles(): Promise<Article[]> {
  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    // If file is empty or malformed, return empty array to trigger regeneration.
    if (!fileContents.trim()) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error: any) {
    // If file doesn't exist, create it and return empty array.
    if (error.code === 'ENOENT') {
      try {
        await fs.writeFile(articlesFilePath, '[]', 'utf-8');
        return [];
      } catch (writeError) {
        console.error("CRITICAL: Failed to create articles.json", writeError);
        return [];
      }
    }
    // If any other error (like JSON parsing), log it and return empty.
    console.error("Error reading or parsing articles.json:", error);
    return [];
  }
}
