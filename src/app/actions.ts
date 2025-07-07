'use server';

import { getArticleBySlug } from '@/lib/data';
import type { FullArticle } from '@/lib/definitions';

/**
 * Triggers the generation and caching of a specific article.
 * This is called by the client to proactively generate content.
 * @param slug The slug of the article to generate.
 * @returns The generated article's final image URL and status, or null on failure.
 */
export async function triggerArticleGeneration(
  slug: string
): Promise<Pick<FullArticle, 'imageUrl' | 'status'> | null> {
  console.log(`[Server Action] Triggering generation for: ${slug}`);
  try {
    // getArticleBySlug contains the full logic for generating and caching.
    // Calling it is enough to trigger the entire process.
    const article = await getArticleBySlug(slug);

    if (article) {
      console.log(
        `[Server Action] Generation for ${slug} completed. Image URL: ${article.imageUrl}`
      );
      return {
        imageUrl: article.imageUrl,
        status: article.status,
      };
    }
    console.warn(`[Server Action] Generation for ${slug} returned null.`);
    return null;
  } catch (error) {
    console.error(`[Server Action] Error generating article for ${slug}:`, error);
    return null;
  }
}
