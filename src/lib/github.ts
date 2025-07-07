
'use server';

import { Octokit } from '@octokit/rest';
import sharp from 'sharp';
import 'dotenv/config';

// Ensure you have GITHUB_TOKEN in your .env file
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'kunal5s'; // As per README
const GITHUB_REPO = 'ai-blog-images'; // As per README
const GITHUB_BRANCH = 'main';

if (!GITHUB_TOKEN) {
    console.warn("GITHUB_TOKEN not found in .env file. Image uploads to GitHub will fail.");
}

const octokit = new Octokit({
    auth: GITHUB_TOKEN,
});

async function compressImage(base64Data: string): Promise<Buffer> {
    const buffer = Buffer.from(base64Data, 'base64');
    // Using webp for better compression and quality
    return sharp(buffer)
        .webp({ quality: 80 })
        .toBuffer();
}

export async function uploadImageToGitHub(base64Data: string, fileName: string): Promise<string> {
    if (!GITHUB_TOKEN) {
        throw new Error("Server configuration error: GitHub token is not configured.");
    }

    const path = `public/images/${fileName}`;

    try {
        const compressedBuffer = await compressImage(base64Data);
        const content = compressedBuffer.toString('base64');
        
        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path,
            message: `feat: Add image for ${fileName}`,
            content: content,
            branch: GITHUB_BRANCH,
            committer: {
                name: 'Car Diagnostics AI',
                email: 'bot@example.com'
            },
            author: {
                name: 'Car Diagnostics AI',
                email: 'bot@example.com'
            }
        });
        
        return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

    } catch (error: any) {
         if (error.status === 422 || error.message?.includes("sha")) { 
             console.log(`Image at path ${path} might already exist. Assuming success.`);
             return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;
        }
        console.error(`Failed to upload image to GitHub:`, error);
        throw new Error('Failed to upload image.');
    }
}
