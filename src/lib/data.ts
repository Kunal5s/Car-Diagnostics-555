
'use server';

import type { FullArticle } from './definitions';

// GitHub configuration - These must be set in your .env.local file
const GITHUB_REPO = process.env.GITHUB_REPO; // e.g., 'your_username/your_repo'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // A GitHub PAT for higher rate limits

const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;

const headers = GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {};

interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    type: 'file' | 'dir';
}

/**
 * Fetches a list of all article JSON files from the GitHub repository.
 * Uses Next.js caching to revalidate every 20 minutes.
 * @returns An array of GitHub file objects.
 */
async function getArticleFileList(): Promise<GitHubFile[]> {
    if (!GITHUB_REPO || GITHUB_REPO === 'your_username/your_repo') {
        console.warn("GITHUB_REPO environment variable is not set or is default. Cannot fetch articles.");
        return [];
    }

    try {
        const url = `${GITHUB_API_BASE}/contents/.cache/articles`;
        // Revalidate this list every 20 minutes to see new articles from the function
        const response = await fetch(url, { headers, next: { revalidate: 1200 } }); 
        
        if (!response.ok) {
            // If repo or directory doesn't exist, return empty array gracefully
            if (response.status === 404) {
                console.warn(`Article directory not found in GitHub repo: ${url}. It may be empty or the repo may be private.`);
                return [];
            }
            throw new Error(`Failed to fetch article list from GitHub: ${response.statusText}`);
        }
        
        const files: GitHubFile[] = await response.json();
        if (!Array.isArray(files)) {
            console.error("Unexpected response from GitHub API when listing articles:", files);
            return [];
        }
        // Filter out any non-JSON files or directories
        return files.filter(file => file.type === 'file' && file.name.endsWith('.json'));
    } catch (error) {
        console.error("Error fetching article list from GitHub:", error);
        return [];
    }
}

/**
 * Provides a list of all article slugs for static page generation.
 */
export async function getAllArticleSlugs(): Promise<string[]> {
  const files = await getArticleFileList();
  return files.map((file) => file.name.replace('.json', ''));
}

/**
 * Fetches a single article's full content by its slug from GitHub.
 * Caches articles for a day once fetched.
 * @param slug The slug of the article to retrieve.
 * @returns A FullArticle object or null if not found.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    if (!GITHUB_REPO) return null;

    try {
        const url = `${GITHUB_RAW_BASE}/.cache/articles/${slug}.json`;
        const response = await fetch(url, { headers, next: { revalidate: 86400 } });
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
 * Fetches all articles from the repository.
 * @returns A promise that resolves to an array of FullArticle objects.
 */
export async function getAllArticles(): Promise<FullArticle[]> {
    const files = await getArticleFileList();
    
    // Sort files by name descending to get the newest first (assuming slugs contain timestamps)
    files.sort((a, b) => b.name.localeCompare(a.name));

    const articlePromises = files.map((file) => {
        const slug = file.name.replace('.json', '');
        return getArticleBySlug(slug);
    });

    const articles = (await Promise.all(articlePromises))
        .filter((a): a is FullArticle => a !== null);
    
    return articles;
}

/**
 * Gets a specified number of the most recent articles.
 * @param count The number of trending articles to return.
 * @returns An array of FullArticle objects.
 */
export async function getTrendingArticles(count: number): Promise<FullArticle[]> {
    const allArticles = await getAllArticles(); // This already sorts by newest
    return allArticles.slice(0, count);
}

/**
 * Gets all articles for a specific category.
 * @param category The category to filter by.
 * @returns An array of FullArticle objects.
 */
export async function getArticlesByCategory(category: string): Promise<FullArticle[]> {
    const allArticles = await getAllArticles(); // This already sorts by newest
    return allArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}
