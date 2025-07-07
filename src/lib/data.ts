
'use server';

import type { ArticleTopic, FullArticle } from './definitions';

// GitHub configuration - These must be set in your .env.local file
const GITHUB_REPO = process.env.GITHUB_REPO; // e.g., 'your_username/your_repo'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // A GitHub PAT for higher rate limits

const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;

const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

/**
 * Fetches a list of all article files from the GitHub repository.
 * @returns An array of file objects from GitHub API.
 */
async function getArticleFileList(): Promise<any[]> {
    if (!GITHUB_REPO || GITHUB_REPO === 'your_username/your_repo') {
        console.warn("GITHUB_REPO environment variable is not set. Cannot fetch articles.");
        return [];
    }

    try {
        const url = `${GITHUB_API_BASE}/contents/.cache/articles`;
        // Revalidate this list every 20 minutes to see new articles from the function
        const response = await fetch(url, { headers, next: { revalidate: 1200 } }); 
        
        if (!response.ok) {
            // If repo or directory doesn't exist, return empty array gracefully
            if (response.status === 404) {
                console.warn("Article directory not found in GitHub repo. It may be empty.");
                return [];
            }
            throw new Error(`Failed to fetch article list from GitHub: ${response.statusText}`);
        }
        
        const files = await response.json();
        if (!Array.isArray(files)) {
            console.error("Unexpected response from GitHub API when listing articles:", files);
            return [];
        }
        return files;
    } catch (error) {
        console.error("Error fetching article list from GitHub:", error);
        return [];
    }
}

/**
 * Provides a list of all article topics with their slugs for static page generation.
 */
export async function getAllTopics(): Promise<ArticleTopic[]> {
  const files = await getArticleFileList();
  return files.map((file: any) => ({
    id: 0, // Not available from file list
    title: '', // Not available from file list
    category: '', // Not available from file list
    slug: file.name.replace('.json', ''),
    imageUrl: null,
    status: 'ready'
  }));
}

/**
 * Fetches a single article's full content by its slug from GitHub.
 * @param slug The slug of the article to retrieve.
 * @returns A FullArticle object or null if not found.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    if (!GITHUB_REPO) return null;

    try {
        const url = `${GITHUB_RAW_BASE}/.cache/articles/${slug}.json`;
        // Cache articles for a day once fetched
        const response = await fetch(url, { next: { revalidate: 86400 } });
        if (!response.ok) {
            return null; // Article not found
        }
        return await response.json() as FullArticle;
    } catch (error) {
        console.error(`Error fetching article ${slug} from GitHub:`, error);
        return null;
    }
}

/**
 * Gets a random selection of articles for display on grid pages.
 * @param count The number of articles to return.
 * @param category Optional category to filter by.
 * @returns An array of FullArticle objects.
 */
export async function getLiveArticles(count: number, category?: string): Promise<FullArticle[]> {
    let allFiles = await getArticleFileList();

    // Shuffle the files to ensure randomness
    for (let i = allFiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allFiles[i], allFiles[j]] = [allFiles[j], allFiles[i]];
    }

    const articlePromises = allFiles.map((file: any) => {
        const slug = file.name.replace('.json', '');
        return getArticleBySlug(slug);
    });

    let articles = (await Promise.all(articlePromises))
        .filter((a): a is FullArticle => a !== null);
    
    if (category) {
        articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    return articles.slice(0, count);
}
