
import { NextRequest, NextResponse } from 'next/server';
import { generateArticle } from '@/ai/flows/generate-article';
import { allArticleTopics } from '@/lib/definitions';
import { slugify } from '@/lib/utils';
import type { FullArticle } from '@/lib/definitions';
import axios from 'axios';

async function getExistingArticleIds(octokit: Octokit, owner: string, repo: string): Promise<Set<number>> {
    const { Octokit } = await import('@octokit/rest'); // Lazy import
    try {
        const { data: files } = await octokit.repos.getContent({
            owner,
            repo,
            path: '_articles',
        });

        if (Array.isArray(files)) {
            const ids = files.map(file => {
                const name = file.name;
                const match = name.match(/-(\d+)\.json$/);
                return match ? parseInt(match[1], 10) : NaN;
            });
            return new Set(ids.filter(id => !isNaN(id)));
        }
        return new Set();
    } catch (error: any) {
        if (error.status === 404) {
            // The directory doesn't exist yet, which is fine.
            return new Set();
        }
        console.error('Error fetching existing articles from GitHub:', error);
        throw error;
    }
}

async function triggerVercelDeploy() {
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!deployHookUrl) {
        console.warn('VERCEL_DEPLOY_HOOK_URL is not set. Skipping automatic redeployment.');
        return;
    }
    try {
        console.log('Triggering Vercel deployment...');
        await axios.post(deployHookUrl);
        console.log('Vercel deployment triggered successfully.');
    } catch (error) {
        console.error('Failed to trigger Vercel deployment:', error);
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
        const missing = [
            !GITHUB_TOKEN && 'GITHUB_TOKEN',
            !GITHUB_REPO_OWNER && 'GITHUB_REPO_OWNER',
            !GITHUB_REPO_NAME && 'GITHUB_REPO_NAME',
        ].filter(Boolean).join(', '); // Filter out false values before joining
        const message = `The following environment variables are not set: ${missing}. The cron job cannot run without them. Please check your Vercel project settings.`;
        console.error(message);
        return NextResponse.json({ message }, { status: 500 });
    }
    
    const { Octokit } = await import('@octokit/rest'); // Lazy import

    try {
        const existingIds = await getExistingArticleIds(octokit, GITHUB_REPO_OWNER, GITHUB_REPO_NAME);
        
        const availableTopics = allArticleTopics.filter(topic => !existingIds.has(topic.id));

        if (availableTopics.length === 0) {
            console.log('All available articles have been generated.');
            return NextResponse.json({ message: 'All available articles have been generated.' });
        }
        
        // Process one topic per run to avoid timeouts and rate limits
        const topicToGenerate = availableTopics[Math.floor(Math.random() * availableTopics.length)];

        try {
            console.log(`Generating article for topic: "${topicToGenerate.title}"`);
            const generatedData = await generateArticle({ topic: topicToGenerate.title, category: topicToGenerate.category });
            
            const slug = slugify(`${generatedData.title}-${topicToGenerate.id}`);
    
            const newArticle: FullArticle = {
                id: topicToGenerate.id,
                title: generatedData.title,
                slug,
                category: topicToGenerate.category,
                summary: generatedData.summary,
                imageUrl: generatedData.imageUrl,
                content: generatedData.content,
            };
    
            const filePath = `_articles/${slug}.json`;
            const content = Buffer.from(JSON.stringify(newArticle, null, 2)).toString('base64');
    
            await octokit.repos.createOrUpdateFileContents({
                owner: GITHUB_REPO_OWNER,
                repo: GITHUB_REPO_NAME,
                path: filePath,
                message: `feat: add article '${generatedData.title}'`,
                content: content,
            });
            
            console.log(`Successfully generated and committed article: ${generatedData.title}.`);
            await triggerVercelDeploy(); // Trigger deployment after successful commit.
            return NextResponse.json({ message: `Successfully generated article: ${generatedData.title}` });

        } catch(error) {
             console.error(`Failed to generate or commit article for topic "${topicToGenerate.title}".`, { 
                message: (error as Error).message,
                stack: (error as Error).stack,
                cause: (error as Error).cause
            });
            return NextResponse.json({ message: `Failed to generate article for topic: ${topicToGenerate.title}`, error: (error as Error).message }, { status: 500 });
        }

    } catch (error) {
        console.error('Error in cron job:', { 
            message: (error as Error).message,
            stack: (error as Error).stack,
            cause: (error as Error).cause
        });
        return NextResponse.json({ message: 'Error running cron job', error: (error as Error).message }, { status: 500 });
    }
}
