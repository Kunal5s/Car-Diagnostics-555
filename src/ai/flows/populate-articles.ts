'use server';
/**
 * @fileOverview A flow to generate and populate all 54 articles for the website.
 * This is a long-running, one-time process that should be manually triggered.
 *
 * - populateAllArticles - The function that orchestrates the generation and saving of all articles.
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

    let articleData: GenerateArticleOutput = {
      summary: "Could not load article summary.",
      content: "There was an error generating this article. Please try again later.",
    };
    let imageUrl = 'https://placehold.co/600x400.png';

    try {
      console.log(`  - Generating article content...`);
      const generatedData = await generateArticle({ topic: topic.title });
      if (generatedData) {
        articleData = generatedData;
      }
    } catch (e: any) {
      console.error(`  - Failed to generate article content for topic: ${topic.title}`, e.message);
      // We still push the article with an error message in the content.
    }

    try {
      console.log(`  - Fetching image for: ${topic.title}`);
      // Use a more specific query for better images
      const fetchedImageUrl = await getImageForQuery(`${topic.title} car automotive`);
      if (fetchedImageUrl) {
        imageUrl = fetchedImageUrl;
      }
    } catch (e: any) {
      console.error(`  - Failed to fetch image for topic: ${topic.title}`, e.message);
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
    return { success: false, error: `Failed to write to articles.json: ${error.message}` };
  }
}
