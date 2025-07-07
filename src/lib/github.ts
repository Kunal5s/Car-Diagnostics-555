
'use server';

/**
 * @fileOverview GitHub API utilities for uploading images.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'kunal5s'; // The owner of the repository
const REPO_NAME = 'ai-blog-images'; // The repository where images are stored
const IMAGE_PATH = 'public/images'; // The folder within the repository

if (!GITHUB_TOKEN) {
    console.warn("[GitHub Uploader] GITHUB_TOKEN is not set. Image uploads will fail.");
}

/**
 * Uploads a base64 encoded image to a public GitHub repository.
 * @param base64DataUri The image data as a base64 data URI (e.g., 'data:image/jpeg;base64,...').
 * @param fileName The desired file name for the image in the repository (e.g., 'my-image.jpg').
 * @returns The permanent URL of the uploaded image or null on failure.
 */
export async function uploadImageToGitHub(base64DataUri: string, fileName: string): Promise<string | null> {
    if (!GITHUB_TOKEN) {
        console.error("GitHub token is not configured. Cannot upload image.");
        // Fallback to a placeholder to prevent crashes
        return `https://placehold.co/600x400.png`;
    }

    try {
        const base64Content = base64DataUri.split(',')[1];
        if (!base64Content) {
            throw new Error("Invalid base64 data URI.");
        }

        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${IMAGE_PATH}/${fileName}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `feat: add image ${fileName}`,
                content: base64Content,
                branch: 'main', 
            }),
        });

        const data = await response.json();

        if (response.ok && data.content?.download_url) {
            // The download_url is good, but for raw content delivery, the raw.githubusercontent.com URL is better.
            const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${IMAGE_PATH}/${fileName}`;
            return rawUrl;
        } else {
            console.error("Failed to upload image to GitHub:", data.message || 'Unknown error');
            return `https://placehold.co/600x400.png`; // Fallback
        }
    } catch (error) {
        console.error("Error during GitHub image upload:", error);
        return `https://placehold.co/600x400.png`; // Fallback
    }
}
