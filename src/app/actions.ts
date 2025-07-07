
'use server';

import type { FullArticle } from '@/lib/definitions';

/**
 * DEPRECATED: This server action is no longer used.
 * The application now relies on pre-generated static content from the cache.
 * Live generation has been disabled to improve performance and reliability.
 * @param slug The slug of the article.
 * @returns Always returns null.
 */
export async function triggerArticleGeneration(
  slug: string
): Promise<Pick<FullArticle, 'imageUrl' | 'status'> | null> {
  console.warn(`[Server Action] DEPRECATED: triggerArticleGeneration called for slug: ${slug}, but this feature is disabled.`);
  return null;
}
