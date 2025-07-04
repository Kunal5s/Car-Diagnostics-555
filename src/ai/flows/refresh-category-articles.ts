'use server';
/**
 * @fileOverview A flow to refresh the articles for a specific category.
 * This is designed to be triggered in the background. It ensures that only one
 * generation process runs at a time to avoid API rate limiting.
 */
import { generateArticle, type GenerateArticleOutput } from '@/ai/flows/generate-article';
import { allArticleTopics } from '@/lib/definitions';
import { getImageForQuery } from '@/lib/pexels';
import { slugify } from '@/lib/utils';
import { promises as fs } from 'fs';
import path from 'path';
import type { Article } from '@/lib/definitions';

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');

// A global lock to prevent multiple generation processes from running at the same time.
let isGenerationRunning = false;

async function readArticles(): Promise<Article[]> {
  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    if (!fileContents.trim()) return [];
    return JSON.parse(fileContents);
  } catch (error) {
    return []; // If file doesn't exist or is corrupt, start fresh.
  }
}

export async function refreshCategoryArticles(categoryName: string): Promise<void> {
  if (isGenerationRunning) {
    console.log(`[refresh] Generation is already in progress. Skipping request for category: "${categoryName}".`);
    return;
  }

  isGenerationRunning = true;
  console.log(`[refresh] Starting article refresh for category: "${categoryName}".`);

  try {
    const topicsForCategory = allArticleTopics.filter(
      (t) => t.category.toLowerCase() === categoryName.toLowerCase()
    );

    if (topicsForCategory.length === 0) {
      console.log(`[refresh] No topics found for category: "${categoryName}". Nothing to do.`);
      return;
    }

    const newArticlesForCategory: Article[] = [];

    for (const topic of topicsForCategory) {
      // Add a delay to respect API rate limits.
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log(`[refresh] - Processing topic: "${topic.title}"`);
      
      let articleData: GenerateArticleOutput;
      let imageUrl: string;

      try {
        articleData = await generateArticle({ topic: topic.title });
      } catch (e: any) {
        console.error(`[refresh]   - ERROR: Content generation failed for "${topic.title}": ${e.message}`);
        // Skip this article if generation fails. It will be retried on the next refresh cycle.
        continue; 
      }

      try {
        imageUrl = await getImageForQuery(topic.title);
      } catch (e: any) {
        console.error(`[refresh]   - ERROR: Image fetch failed for "${topic.title}": ${e.message}`);
        imageUrl = 'https://placehold.co/600x400.png'; // Use placeholder on failure
      }

      newArticlesForCategory.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary: articleData.summary,
        content: articleData.content,
        imageUrl,
        slug: `${slugify(topic.title)}-${topic.id}`,
        generatedAt: Date.now(),
      });
    }
    
    // Atomically update the JSON file.
    const allArticles = await readArticles();
    const otherArticles = allArticles.filter(
      (a) => a.category.toLowerCase() !== categoryName.toLowerCase()
    );
    const updatedArticles = [...otherArticles, ...newArticlesForCategory];
    
    await fs.writeFile(articlesFilePath, JSON.stringify(updatedArticles, null, 2));
    console.log(`[refresh] Successfully refreshed ${newArticlesForCategory.length} articles for category "${categoryName}".`);

  } catch (error: any) {
    console.error(`[refresh] CRITICAL: A failure occurred during the article refresh process for "${categoryName}": ${error.message}`);
  } finally {
    isGenerationRunning = false;
    console.log(`[refresh] Generation process finished for category: "${categoryName}".`);
  }
}
