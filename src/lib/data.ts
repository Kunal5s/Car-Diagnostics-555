
'use server';

import type { FullArticle } from './definitions';
import { promises as fs } from 'fs';
import path from 'path';

const articlesDir = path.join(process.cwd(), '_articles');

async function getArticleFiles() {
  try {
    // Check if the directory exists
    await fs.access(articlesDir);
    const files = await fs.readdir(articlesDir);
    return files.filter(file => file.endsWith('.json'));
  } catch (error) {
    // Directory doesn't exist, return empty array
    console.warn("'_articles' directory not found. No articles will be loaded.");
    return [];
  }
}

async function readArticleFile(file: string): Promise<FullArticle | null> {
  try {
    const filePath = path.join(articlesDir, file);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading or parsing article file: ${file}`, error);
    return null;
  }
}

export async function getAllArticles(): Promise<FullArticle[]> {
  const files = await getArticleFiles();
  if (files.length === 0) {
    return [];
  }
  
  const articlePromises = files.map(readArticleFile);
  const articles = await Promise.all(articlePromises);

  // Filter out any nulls from failed reads and sort by ID descending
  return (articles.filter(a => a) as FullArticle[]).sort((a, b) => b.id - a.id);
}

export async function getRecentArticles(count: number): Promise<FullArticle[]> {
  const allArticles = await getAllArticles();
  return allArticles.slice(0, count);
}


export async function getArticlesByCategory(category: string): Promise<FullArticle[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(a => a.category.toLowerCase() === category.toLowerCase());
}

export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const files = await getArticleFiles();
    const fileName = files.find(file => file.replace('.json', '') === slug);

    if (!fileName) {
        return null;
    }
    
    return readArticleFile(fileName);
}

export async function getAllArticleSlugs(): Promise<string[]> {
    const files = await getArticleFiles();
    return files.map(file => file.replace('.json', ''));
}
