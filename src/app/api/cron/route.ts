
import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { generateArticle } from '@/ai/flows/generate-article';
import { generateTakeaways } from '@/ai/flows/generate-takeaways';
import { allArticleTopics } from '@/lib/definitions';
import { slugify } from '@/lib/utils';
import type { FullArticle } from '@/lib/definitions';
import axios from 'axios';

async function getExistingArticleSlugs(octokit: Octokit, owner: string, repo: string): Promise<Set<number>> {
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
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME || !GEMINI_API_KEY) {
        const missing = [
            !GITHUB_TOKEN && 'GITHUB_TOKEN',
            !GITHUB_REPO_OWNER && 'GITHUB_REPO_OWNER',
            !GITHUB_REPO_NAME && 'GITHUB_REPO_NAME',
            !GEMINI_API_KEY && 'GEMINI_API_KEY'
        ].filter(Boolean).join(', ');
        const message = `The following environment variables are not set: ${missing}. The cron job cannot run without them.`;
        console.error(message);
        return NextResponse.json({ message }, { status: 500 });
    }
    
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    try {
        const existingIds = await getExistingArticleSlugs(octokit, GITHUB_REPO_OWNER, GITHUB_REPO_NAME);
        
        const availableTopics = allArticleTopics.filter(topic => !existingIds.has(topic.id));

        if (availableTopics.length === 0) {
            return NextResponse.json({ message: 'All available articles have been generated.' });
        }
        
        const topicToGenerate = availableTopics[0]; // Process one topic per run to avoid timeouts/rate limits

        try {
            console.log(`Generating article for topic: "${topicToGenerate.title}"`);
            const generatedData = await generateArticle({ topic: topicToGenerate.title, category: topicToGenerate.category });
            
            let finalContent = generatedData.content;
            // If the model forgot the takeaways, generate them separately as a fallback.
            if (!finalContent.includes('## 6 Key Takeaways')) {
                console.warn(`Article for "${topicToGenerate.title}" was generated without takeaways. Generating them now as a fallback.`);
                try {
                    const takeawaysResult = await generateTakeaways({ title: generatedData.title, content: finalContent });
                    finalContent += `\n\n${takeawaysResult.takeaways}`;
                } catch (takeawayError) {
                    console.error(`Could not generate takeaways for "${topicToGenerate.title}". The article will be saved without them.`, takeawayError);
                }
            }
            
            const slug = slugify(`${generatedData.title}-${topicToGenerate.id}`);
    
            const newArticle: FullArticle = {
                id: topicToGenerate.id,
                category: topicToGenerate.category,
                slug,
                ...generatedData,
                content: finalContent,
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
            return NextResponse.json({ message: `Failed to generate article for topic: ${topicToGenerate.title}` }, { status: 500 });
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
