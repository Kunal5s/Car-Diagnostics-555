'use server';
/**
 * @fileOverview A flow to generate and populate all 54 articles for the website.
 * This is a long-running, one-time process that should be triggered by an admin.
 */

import { generateArticle, type GenerateArticleOutput } from '@/ai/flows/generate-article';
import { allArticleTopics } from '@/lib/definitions';
import { getImageForQuery } from '@/lib/pexels';
import { slugify } from '@/lib/utils';
import { promises as fs } from 'fs';
import path from 'path';

export interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl: string;
  slug: string;
}

const FAILED_GENERATION_TEXT = "Content Generation Failed";

// A lock to prevent multiple generation processes from running at the same time.
let isGenerationRunning = false;

export async function populateAllArticles(): Promise<void> {
  if (isGenerationRunning) {
    console.log("[populate] Generation is already in progress. Skipping new request.");
    return;
  }
  
  isGenerationRunning = true;
  console.log("Starting batch generation of all articles. This will take a long time.");
  const articles: Article[] = [];
  const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
  let generatedCount = 0;
  
  try {
    for (const topic of allArticleTopics) {
      // Wait for 10 seconds to respect API rate limits.
      await new Promise(resolve => setTimeout(resolve, 10000));
      console.log(`[populate] - Processing topic: "${topic.title}"`);

      let articleData: GenerateArticleOutput | null = null;
      let imageUrl: string = 'https://placehold.co/600x400.png';
      let success = true;

      try {
        console.log(`[populate]   - Generating article content...`);
        articleData = await generateArticle({ topic: topic.title });
      } catch (e: any) {
        const errorMessage = `Content generation failed for "${topic.title}": ${e.message}`;
        console.error(`[populate]   - ERROR: ${errorMessage}`);
        success = false;
      }

      try {
        console.log(`[populate]   - Fetching image for: ${topic.title}`);
        imageUrl = await getImageForQuery(topic.title);
      } catch (e: any) {
        const errorMessage = `Image fetch failed for "${topic.title}": ${e.message}`;
        console.error(`[populate]   - ERROR: ${errorMessage}`);
      }
      
      if (success && articleData) {
        generatedCount++;
        articles.push({
          id: topic.id,
          title: topic.title,
          category: topic.category,
          summary: articleData.summary,
          content: articleData.content,
          imageUrl,
          slug: `${slugify(topic.title)}-${topic.id}`,
        });
      } else {
         articles.push({
          id: topic.id,
          title: topic.title,
          category: topic.category,
          summary: "Error: Failed to generate article summary.",
          content: `# ${FAILED_GENERATION_TEXT}\n\nThis article could not be generated. This may be due to API rate limits or a content policy violation. Please check the server logs.`,
          imageUrl,
          slug: `${slugify(topic.title)}-${topic.id}`,
        });
      }
    }

    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`[populate] Wrote ${articles.length} articles to cache. ${generatedCount} were successful.`);

  } catch (error: any) {
    const criticalError = `[populate] CRITICAL: Failed to write final articles cache file: ${error.message}`;
    console.error(criticalError);
  } finally {
    isGenerationRunning = false;
    console.log("[populate] Generation process finished.");
  }
}
