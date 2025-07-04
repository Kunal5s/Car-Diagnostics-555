'use server';
/**
 * @fileOverview A flow to generate and populate all 54 articles for the website.
 * This is a long-running, one-time process that should be manually triggered from the admin panel.
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

export async function populateAllArticles(): Promise<{
  success: boolean;
  articlesGenerated: number;
  totalArticles: number;
  errors: string[];
}> {
  console.log("Starting batch generation of all articles. This will take a long time.");
  const articles: Article[] = [];
  const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
  const errors: string[] = [];
  let successfulGenerations = 0;

  for (const topic of allArticleTopics) {
    // Wait for 10 seconds to respect API rate limits.
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log(`- Processing topic: "${topic.title}"`);

    let articleData: GenerateArticleOutput | null = null;
    let imageUrl: string = 'https://placehold.co/600x400.png';

    try {
      console.log(`  - Generating article content...`);
      articleData = await generateArticle({ topic: topic.title });
    } catch (e: any) {
      const errorMessage = `Content generation failed for "${topic.title}": ${e.message}`;
      console.error(`  - ERROR: ${errorMessage}`);
      errors.push(errorMessage);
    }

    try {
      console.log(`  - Fetching image for: ${topic.title}`);
      imageUrl = await getImageForQuery(topic.title);
    } catch (e: any) {
      const errorMessage = `Image fetch failed for "${topic.title}": ${e.message}`;
      console.error(`  - ERROR: ${errorMessage}`);
      // It's okay to have an image error but still save the article, so we just log it.
      errors.push(errorMessage);
    }
    
    // Only count as successful if the content was generated.
    if (articleData) {
        successfulGenerations++;
    }

    articles.push({
      id: topic.id,
      title: topic.title,
      category: topic.category,
      summary: articleData?.summary ?? "Error: Failed to generate article summary.",
      content: articleData?.content ?? `# ${FAILED_GENERATION_TEXT}\n\nThis article could not be generated. This may be due to API rate limits or a content policy violation. Please check the server logs.`,
      imageUrl,
      slug: `${slugify(topic.title)}-${topic.id}`,
    });
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    const resultMessage = `Wrote ${articles.length} articles to cache. Successful content generations: ${successfulGenerations}/${allArticleTopics.length}.`;
    console.log(resultMessage);
    return { success: true, articlesGenerated: successfulGenerations, totalArticles: allArticleTopics.length, errors };
  } catch (error: any) {
    const criticalError = `CRITICAL: Failed to write final articles cache file: ${error.message}`;
    console.error(criticalError);
    // Even if writing fails, we return the errors that happened during generation.
    errors.push(criticalError);
    return { success: false, articlesGenerated: successfulGenerations, totalArticles: allArticleTopics.length, errors };
  }
}
