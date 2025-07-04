
import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';
import { populateAllArticles } from '@/ai/flows/populate-articles';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');

// In-memory cache to prevent constant file reads after initial load
let memoryCache: Article[] | null = null;
// In-memory flag to ensure the generation is triggered only once per server instance
let generationTriggered = false;

export async function getArticles(): Promise<Article[]> {
  // If we have full articles in memory, serve them immediately.
  if (memoryCache) {
    return memoryCache;
  }
  
  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    const articles: Article[] = JSON.parse(fileContents);
    
    // Check if the content is still the initial placeholder content.
    const isPlaceholderContent = articles.length > 0 && articles[0].content.includes("is currently being generated");

    // If it's placeholder content and we haven't already started the generation...
    if (isPlaceholderContent && !generationTriggered) {
      // Set the flag to true immediately to prevent other requests from starting it again.
      generationTriggered = true; 
      console.log("[data.ts] Placeholder content found. Triggering background article generation ONCE.");
      
      // We do not 'await' this. It runs in the background.
      populateAllArticles().then(() => {
        // Once generation finishes, we clear the memory cache.
        // The next person to load a page will read the newly generated file.
        memoryCache = null;
        console.log("[data.ts] Background generation process has completed.");
      }).catch(error => {
        console.error("[data.ts] The background generation process encountered a critical error:", error);
        // Even on error, we mark generation as not triggered so it can be retried on next server start.
        generationTriggered = false; 
      });
    }

    // If the content is NOT placeholder content, it means the real articles are ready.
    // We cache them in memory for all subsequent requests.
    if (!isPlaceholderContent) {
      memoryCache = articles; 
    }

    // Always return whatever is currently in the articles.json file.
    return articles; 
  } catch (error) {
    // This catches errors like the file not existing or being corrupt.
    console.error("Could not read articles.json:", error);
    return [];
  }
}
