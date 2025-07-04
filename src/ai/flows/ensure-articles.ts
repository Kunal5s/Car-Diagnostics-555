'use server';
/**
 * @fileOverview A flow to ensure articles for a specific category are generated and cached.
 * This is triggered on-demand when a user visits a category page.
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

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');

async function readCachedArticles(): Promise<Article[]> {
  try {
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    if (fileContents) {
      return JSON.parse(fileContents);
    }
  } catch (error) {
    // File might not exist, which is fine.
    console.log("Article cache not found. A new one will be created.");
  }
  return [];
}

export async function ensureCategoryArticles(categoryName: string): Promise<Article[]> {
  console.log(`Ensuring articles exist for category: ${categoryName}`);
  
  const topicsForCategory = allArticleTopics.filter(
    (topic) => topic.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (topicsForCategory.length === 0) {
    console.warn(`No topics found for category: ${categoryName}`);
    return [];
  }

  const allCachedArticles = await readCachedArticles();
  const existingSlugs = new Set(allCachedArticles.map(a => a.slug));
  
  const articlesToGenerate = topicsForCategory.filter(
    (topic) => !existingSlugs.has(`${slugify(topic.title)}-${topic.id}`)
  );

  if (articlesToGenerate.length > 0) {
    console.log(`Found ${articlesToGenerate.length} missing articles for "${categoryName}". Starting generation...`);
    const newlyGeneratedArticles: Article[] = [];

    for (const topic of articlesToGenerate) {
      // Respect API rate limits. 15 reqs/min -> 4s per request. Let's do 5s to be safe.
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log(`- Generating article for topic: "${topic.title}"`);

      let articleData: GenerateArticleOutput | null = null;
      let imageUrl: string = 'https://placehold.co/600x400.png';

      try {
        articleData = await generateArticle({ topic: topic.title });
      } catch (e: any) {
        console.error(`  - ERROR: Content generation failed for "${topic.title}": ${e.message}`);
      }
      
      try {
        imageUrl = await getImageForQuery(topic.title);
      } catch (e: any) {
        console.error(`  - ERROR: Image fetch failed for "${topic.title}": ${e.message}`);
      }
      
      newlyGeneratedArticles.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary: articleData?.summary ?? "Error: Failed to generate summary.",
        content: articleData?.content ?? "# Content Generation Failed\n\nThis article could not be generated due to an API error. Please try again later.",
        imageUrl,
        slug: `${slugify(topic.title)}-${topic.id}`,
      });
    }

    const updatedArticles = [...allCachedArticles, ...newlyGeneratedArticles];
    try {
      await fs.writeFile(articlesFilePath, JSON.stringify(updatedArticles, null, 2));
      console.log(`Successfully generated ${newlyGeneratedArticles.length} articles and updated cache.`);
    } catch (error: any) {
      console.error(`CRITICAL: Failed to write final articles cache file: ${error.message}`);
      throw new Error(error);
    }
    
    return updatedArticles.filter(a => a.category.toLowerCase() === categoryName.toLowerCase());
  } else {
    console.log(`All articles for "${categoryName}" are already cached.`);
    return allCachedArticles.filter(a => a.category.toLowerCase() === categoryName.toLowerCase());
  }
}
