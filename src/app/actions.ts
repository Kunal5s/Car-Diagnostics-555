
'use server';

import { getArticleBySlug, updateArticleCache } from '@/lib/data';
import { generateImage } from '@/ai/flows/generate-image';
import { uploadImageToGitHub } from '@/lib/github';
import { slugify } from '@/lib/utils';
import type { ArticleTopic } from '@/lib/definitions';

interface GenerateImagePayload {
    slug: string;
    title: string;
    category: string;
}

/**
 * Generates an image for an article, uploads it, and caches the permanent URL.
 * @param payload - The article information.
 * @returns The updated article topic with the new image URL, or null on failure.
 */
export async function generateAndCacheImage(payload: GenerateImagePayload): Promise<ArticleTopic | null> {
    const { slug, title, category } = payload;
    
    try {
        console.log(`[Action] Starting image generation for: "${title}"`);

        // 1. Check if image already exists to avoid re-generation
        const existingArticle = await getArticleBySlug(slug);
        if (existingArticle?.imageUrl) {
            console.log(`[Action] Image already exists for "${title}". Skipping.`);
            return existingArticle;
        }

        // 2. Generate an image prompt
        const imagePrompt = `A high-quality, photorealistic, cinematic hero image for an automotive article titled "${title}". Focus on the core concepts of the article. Keywords: ${category}. Style: professional, clean, high-detail.`;

        // 3. Generate the image as a base64 data URI
        const base64DataUri = await generateImage({ prompt: imagePrompt });
        if (!base64DataUri) {
            throw new Error('Failed to generate image from AI model.');
        }

        // 4. Upload the image to GitHub to get a permanent URL
        const fileName = `${slug}.jpg`;
        const permanentImageUrl = await uploadImageToGitHub(base64DataUri, fileName);
        if (!permanentImageUrl) {
            throw new Error('Failed to upload image to GitHub.');
        }
        console.log(`[Action] Image uploaded for "${title}": ${permanentImageUrl}`);

        // 5. Update the article's cache file with the new image URL
        await updateArticleCache(slug, { imageUrl: permanentImageUrl });
        
        // 6. Return the updated topic data
        const updatedArticle = await getArticleBySlug(slug);
        if (!updatedArticle) {
            throw new Error("Could not retrieve updated article from cache.");
        }

        return {
            id: updatedArticle.id,
            title: updatedArticle.title,
            category: updatedArticle.category,
            slug: updatedArticle.slug,
            imageUrl: updatedArticle.imageUrl,
            status: updatedArticle.status,
        };

    } catch (error) {
        console.error(`[Action Error] Failed to process image for slug ${slug}:`, error);
        return null; // Indicate failure
    }
}
