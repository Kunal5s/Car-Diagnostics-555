
'use server';

import type { FullArticle } from '@/lib/definitions';
import { getArticleBySlug, updateArticleCache } from '@/lib/data';
import { generateImage } from '@/ai/flows/generate-image';
import { uploadImageToGitHub } from '@/lib/github';

/**
 * Generates an image for a given article slug, uploads it, and updates the cache.
 * @param slug The slug of the article.
 * @returns An object containing the new image URL, or null on failure.
 */
export async function generateImageForArticle(
  slug: string
): Promise<{ imageUrl: string | null }> {
  try {
    const article = await getArticleBySlug(slug);

    if (!article) {
      throw new Error('Article not found for image generation.');
    }

    // If a real image already exists, no need to regenerate.
    if (article.imageUrl && !article.imageUrl.includes('placehold.co')) {
      return { imageUrl: article.imageUrl };
    }

    // 1. Generate image using the AI flow
    const imageResult = await generateImage({ topic: article.title });
    if (!imageResult || !imageResult.base64) {
      throw new Error('AI image generation failed to return data.');
    }

    // 2. Upload the compressed image to GitHub
    const imageUrl = await uploadImageToGitHub(imageResult.base64, `${slug}.webp`);
    if (!imageUrl) {
      throw new Error('Failed to upload image to GitHub.');
    }

    // 3. Update the cache file with the new image URL
    await updateArticleCache(slug, { imageUrl });

    return { imageUrl };

  } catch (error) {
    console.error(`[Action Error] Failed to generate image for slug ${slug}:`, error);
    return { imageUrl: null };
  }
}
