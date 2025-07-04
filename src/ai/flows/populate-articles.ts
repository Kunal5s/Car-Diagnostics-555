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

export async function populateAllArticles(): Promise<{
  success: boolean;
  articlesGenerated?: number;
  error?: string;
}> {
  console.log("Starting batch generation of all articles. This will take a long time.");
  const articles: Article[] = [];
  const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');

  for (const topic of allArticleTopics) {
    // Wait for a few seconds to respect API rate limits. 15 reqs/min -> 4s per request. Let's do 6s to be safe.
    await new Promise(resolve => setTimeout(resolve, 6000));
    console.log(`- Processing topic: "${topic.title}"`);

    let articleData: GenerateArticleOutput;
    let imageUrl: string;

    try {
      console.log(`  - Generating article content...`);
      articleData = await generateArticle({ topic: topic.title });
    } catch (e: any) {
      console.error(`  - CRITICAL: Failed to generate article content for topic: ${topic.title}`, e.message);
      // Stop the entire process if a single article fails to generate.
      throw new Error(`Failed on topic "${topic.title}": ${e.message}`);
    }

    try {
      console.log(`  - Fetching image for: ${topic.title}`);
      // Use the specific article title for a more relevant image query.
      imageUrl = await getImageForQuery(topic.title);
    } catch (e: any)      {
      console.error(`  - CRITICAL: Failed to fetch image for topic: ${topic.title}`, e.message);
       // Stop the entire process if an image fails to fetch.
       throw new Error(`Failed to fetch image for "${topic.title}": ${e.message}`);
    }

    articles.push({
      id: topic.id,
      title: topic.title,
      category: topic.category,
      summary: articleData.summary,
      content: articleData.content,
      imageUrl,
      slug: `${slugify(topic.title)}-${topic.id}`,
    });
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`SUCCESS: Saved ${articles.length} generated articles to cache file: ${articlesFilePath}`);
    return { success: true, articlesGenerated: articles.length };
  } catch (error: any) {
    console.error("CRITICAL: Failed to write final articles cache file:", error);
    // This is a critical failure, throw it so the client knows.
    throw new Error(`Failed to write articles.json: ${error.message}`);
  }
}
