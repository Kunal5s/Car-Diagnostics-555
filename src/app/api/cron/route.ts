
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { generateArticle } from '@/ai/flows/generate-article';
import { allArticleTopics } from '@/lib/definitions';
import { slugify } from '@/lib/utils';
import type { FullArticle } from '@/lib/definitions';

// Revalidate the page every 24 hours
export const revalidate = 86400;

async function getExistingArticleSlugs(octokit: Octokit, owner: string, repo: string): Promise<string[]> {
    try {
        const { data: files } = await octokit.repos.getContent({
            owner,
            repo,
            path: '_articles',
        });

        if (Array.isArray(files)) {
            return files.map(file => file.name.replace('.json', ''));
        }
        return [];
    } catch (error: any) {
        if (error.status === 404) {
            // The directory doesn't exist yet, which is fine.
            return [];
        }
        console.error('Error fetching existing articles from GitHub:', error);
        throw error;
    }
}


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const CRON_SECRET = process.env.CRON_SECRET;

    if (secret !== CRON_SECRET) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO_OWNER = process.env.GITHUB_REPO_OWNER;
    const GITHUB_REPO_NAME = process.env.GITHUB_REPO_NAME;

    if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
        return NextResponse.json({ message: 'GitHub environment variables are not set.' }, { status: 500 });
    }
    
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    try {
        const existingSlugs = await getExistingArticleSlugs(octokit, GITHUB_REPO_OWNER, GITHUB_REPO_NAME);
        const existingIds = new Set(existingSlugs.map(slug => parseInt(slug.split('-').pop() || '0')));

        const topicToGenerate = allArticleTopics.find(topic => !existingIds.has(topic.id));

        if (!topicToGenerate) {
            return NextResponse.json({ message: 'All articles have been generated.' });
        }

        console.log(`Generating article for topic: "${topicToGenerate.title}"`);
        const generatedData = await generateArticle({ topic: topicToGenerate.title, category: topicToGenerate.category });
        
        const slug = slugify(`${topicToGenerate.title}-${topicToGenerate.id}`);

        const newArticle: FullArticle = {
            ...topicToGenerate,
            slug,
            ...generatedData,
        };

        const filePath = `_articles/${slug}.json`;
        const content = Buffer.from(JSON.stringify(newArticle, null, 2)).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_REPO_OWNER,
            repo: GITHUB_REPO_NAME,
            path: filePath,
            message: `feat: add article '${topicToGenerate.title}'`,
            content: content,
        });

        console.log(`Successfully generated and committed article: ${filePath}`);
        return NextResponse.json({ message: `Successfully generated article: ${topicToGenerate.title}` });

    } catch (error) {
        console.error('Error in cron job:', { 
            message: (error as Error).message,
            stack: (error as Error).stack,
            cause: (error as Error).cause
        });
        return NextResponse.json({ message: 'Error generating article', error: (error as Error).message }, { status: 500 });
    }
}
