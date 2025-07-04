import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from './definitions';
import { populateAllArticles } from '@/ai/flows/populate-articles';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
const lockFilePath = path.join(process.cwd(), 'generating.lock');

let memoryCache: Article[] | null = null;
let isGenerationRunning = false;

// This function starts the one-time generation process.
async function manageArticleGeneration() {
  // 1. Check if generation is already running.
  if (isGenerationRunning) return;
  
  // 2. Check for a lock file in case of server restart during generation.
  try {
    await fs.access(lockFilePath);
    console.log('[data.ts] Generation lock file found. Assuming process is running.');
    isGenerationRunning = true;
    return;
  } catch {
    // No lock file, continue.
  }

  // 3. Check if articles.json already has significant content.
  try {
    const stats = await fs.stat(articlesFilePath);
    if (stats.size > 100) { // > 100 bytes is a safe bet for existing content
      console.log('[data.ts] Articles already exist. Skipping generation.');
      return;
    }
  } catch {
    // File probably doesn't exist, which is fine. Continue to generation.
  }
  
  // 4. If we're here, we need to generate.
  isGenerationRunning = true;
  console.log('[data.ts] Starting one-time article generation in the background.');
  
  try {
    await fs.writeFile(lockFilePath, 'locked'); // Create lock file
    await populateAllArticles(); // Run the full, robust generation process
  } catch (error) {
    console.error('[data.ts] A critical error occurred during article generation:', error);
  } finally {
    await fs.unlink(lockFilePath).catch(err => console.error("Could not remove lock file", err)); // Remove lock
    console.log('[data.ts] Article generation process finished.');
    isGenerationRunning = false;
    memoryCache = null; // Clear memory cache to force re-read from disk on next request
  }
}

// Fire-and-forget the generation process when the server starts.
// This is non-blocking.
manageArticleGeneration();

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
    // This is expected if the file doesn't exist yet while generation is running.
    // The UI will show a loading/generation message.
    return [];
  }
}
