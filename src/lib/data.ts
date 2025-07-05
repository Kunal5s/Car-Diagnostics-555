
import { slugify } from "./utils";
import { promises as fs } from 'fs';
import path from 'path';
import type { FullArticle } from "./definitions";

const articlesFilePath = path.join(process.cwd(), 'src', 'lib', 'articles.json');
let cachedArticles: FullArticle[] | null = null;
let articlesPromise: Promise<FullArticle[]> | null = null;

async function loadArticles(): Promise<FullArticle[]> {
  // If we have a cached version in memory, return it.
  if (cachedArticles) {
    return cachedArticles;
  }

  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    const articlesFromFile: FullArticle[] = JSON.parse(data);
    
    if (articlesFromFile && articlesFromFile.length > 0) {
      console.log(`Loaded ${articlesFromFile.length} articles from file cache.`);
      cachedArticles = articlesFromFile;
      return cachedArticles;
    }
  } catch (error) {
    console.error("Error loading articles from 'src/lib/articles.json'. Please ensure the file exists and contains a valid JSON array. The application will not have any content until this is resolved.", error);
  }

  // If the file doesn't exist, is empty, or fails to parse, return an empty array.
  // The application will not attempt to generate content on the fly.
  return [];
}

export async function getArticles(): Promise<FullArticle[]> {
  if (!articlesPromise) {
    articlesPromise = loadArticles();
  }
  return articlesPromise;
}

export async function getHomepageArticles(): Promise<FullArticle[]> {
    const articles = await getArticles();
    // Return the first 6 articles for the homepage.
    return articles.slice(0, 6);
}

export async function getArticlesByCategory(categoryName: string): Promise<FullArticle[]> {
    const articles = await getArticles();
    const lowerCategoryName = categoryName.toLowerCase();
    
    if (lowerCategoryName === 'all') {
      return articles;
    }
    
    return articles.filter(article => article.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    const articles = await getArticles();
    return articles.find(article => article.slug === slug);
}
