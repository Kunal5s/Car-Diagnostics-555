
'use server';

import { generateImage } from '@/ai/flows/generate-image';
import { uploadImageToGitHub } from '@/lib/github';

interface GenerateImagePayload {
    slug: string;
    title: string;
    category: string;
}

interface GeneratedImageResult {
    slug: string;
    imageUrl: string | null;
}

/**
 * Generates a unique image for an article and uploads it. Does NOT cache the URL.
 * @param payload - The article information.
 * @returns An object with the slug and the new temporary image URL, or null on failure.
 */
export async function generateLiveImage(payload: GenerateImagePayload): Promise<GeneratedImageResult | null> {
    const { slug, title, category } = payload;
    
    try {
        console.log(`[Live Action] Generating unique image for: "${title}"`);

        const imagePrompt = `A high-quality, photorealistic, cinematic hero image for an automotive article titled "${title}". Focus on the core concepts of the article. Keywords: ${category}. Style: professional, clean, high-detail.`;

        const base64DataUri = await generateImage({ prompt: imagePrompt });
        if (!base64DataUri) {
            throw new Error('Failed to generate image from AI model.');
        }

        // Add a timestamp to the filename to ensure it's always unique on GitHub
        const fileName = `${slug}-${Date.now()}.jpg`;
        const permanentImageUrl = await uploadImageToGitHub(base64DataUri, fileName);
        if (!permanentImageUrl) {
            throw new Error('Failed to upload image to GitHub.');
        }
        console.log(`[Live Action] Unique image uploaded for "${title}": ${permanentImageUrl}`);

        return {
            slug: slug,
            imageUrl: permanentImageUrl,
        };

    } catch (error) {
        console.error(`[Live Action Error] Failed to process image for slug ${slug}:`, error);
        return { slug: slug, imageUrl: null }; // Return slug with null image on failure
    }
}
