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
const FAILED_GENERATION_TEXT = "Content Generation Failed";

async function readCachedArticles(): Promise<Article[]> {
  try {
    await fs.mkdir(path.dirname(articlesFilePath), { recursive: true });
    await fs.access(articlesFilePath).catch(() => fs.writeFile(articlesFilePath, '[]'));
    const fileContents = await fs.readFile(articlesFilePath, 'utf-8');
    if (fileContents) {
      return JSON.parse(fileContents);
    }
  } catch (error) {
    console.error("Error reading or creating article cache file:", error);
  }
  return [];
}

export async function ensureCategoryArticles(categoryName: string): Promise<Article[]> {
  console.log(`[ensure-articles] Starting process for category: ${categoryName}`);
  
  const topicsForCategory = allArticleTopics.filter(
    (topic) => topic.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (topicsForCategory.length === 0) {
    console.warn(`[ensure-articles] No topics found for category: ${categoryName}`);
    return [];
  }

  let allCachedArticles = await readCachedArticles();
  
  const articlesToGenerate = topicsForCategory.filter((topic) => {
      const slug = `${slugify(topic.title)}-${topic.id}`;
      const existingArticle = allCachedArticles.find(a => a.slug === slug);
      if (!existingArticle || existingArticle.content.includes(FAILED_GENERATION_TEXT)) {
          if (!existingArticle) {
              console.log(`[ensure-articles] Article for topic "${topic.title}" not found. Queued for generation.`);
          } else {
              console.log(`[ensure-articles] Article for topic "${topic.title}" contains failed content. Queued for regeneration.`);
          }
          return true;
      }
      return false;
  });

  if (articlesToGenerate.length > 0) {
    console.log(`[ensure-articles] Found ${articlesToGenerate.length} missing or failed articles for "${categoryName}". Starting generation...`);
    const newlyGeneratedArticles: Article[] = [];

    // Filter out the failed articles that are about to be regenerated from the main cache
    const validCachedArticles = allCachedArticles.filter(a => !articlesToGenerate.some(t => `${slugify(t.title)}-${t.id}` === a.slug));

    for (const topic of articlesToGenerate) {
      // Respect API rate limits. 15 reqs/min -> 4s per request. Let's do 5s to be safe.
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log(`[ensure-articles] - Generating article for topic: "${topic.title}"`);

      let articleData: GenerateArticleOutput | null = null;
      let imageUrl: string = 'https://placehold.co/600x400.png';

      try {
        articleData = await generateArticle({ topic: topic.title });
      } catch (e: any) {
        console.error(`[ensure-articles]   - ERROR: Content generation failed for "${topic.title}": ${e.message}`);
      }
      
      try {
        imageUrl = await getImageForQuery(topic.title);
      } catch (e: any) {
        console.error(`[ensure-articles]   - ERROR: Image fetch failed for "${topic.title}": ${e.message}`);
      }
      
      newlyGeneratedArticles.push({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        summary: articleData?.summary ?? "Error: Failed to generate summary.",
        content: articleData?.content ?? `# ${FAILED_GENERATION_TEXT}\n\nThis article could not be generated due to an API error. Please check the server logs.`,
        imageUrl,
        slug: `${slugify(topic.title)}-${topic.id}`,
      });
    }

    const updatedArticles = [...validCachedArticles, ...newlyGeneratedArticles];
    try {
      await fs.writeFile(articlesFilePath, JSON.stringify(updatedArticles, null, 2));
      console.log(`[ensure-articles] Successfully generated ${newlyGeneratedArticles.length} articles and updated cache.`);
    } catch (error: any) {
      console.error(`[ensure-articles] CRITICAL: Failed to write final articles cache file: ${error.message}`);
    }
    
    return updatedArticles.filter(a => a.category.toLowerCase() === categoryName.toLowerCase());
  } else {
    console.log(`[ensure-articles] All articles for "${categoryName}" are already cached and valid.`);
    return allCachedArticles.filter(a => a.category.toLowerCase() === categoryName.toLowerCase());
  }
}