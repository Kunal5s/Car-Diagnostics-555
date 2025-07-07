
'use server';

import { generateAndCacheImageOnly } from '@/lib/data';

export async function getGeneratedImageUrl(slug: string, title: string, category: string): Promise<string | null> {
    try {
        const url = await generateAndCacheImageOnly(slug, title, category);
        return url;
    } catch (error) {
        console.error(`[Server Action] Failed to generate image for ${slug}:`, error);
        return null;
    }
}
