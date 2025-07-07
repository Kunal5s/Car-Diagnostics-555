
'use server';

import type { FullArticle, ArticleTopic } from './definitions';
import { slugify } from './utils';
import { promises as fs } from 'fs';
import path from 'path';
import { generateArticle } from '@/ai/flows/generate-article';

const allArticleTopics: ArticleTopic[] = [
  // Engine
  { id: 1, title: "Diagnosing Common Car Engine Performance Issues For Beginners", category: "Engine" },
  { id: 2, title: "Your Step-by-Step Guide to Resolving Car Engine Overheating", category: "Engine" },
  { id: 3, title: "How to Know When to Replace Your Timing Belt", category: "Engine" },
  { id: 4, title: "Top Five Reasons Your Car's Check Engine Light Is On", category: "Engine" },
  { id: 5, title: "Advanced Turbocharger System Diagnostic Techniques For Modern Cars", category: "Engine" },
  // Sensors
  { id: 7, title: "A Complete Guide To Testing And Replacing Faulty Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role of Oxygen Sensors In Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Clean Your Mass Airflow Sensor For Performance", category: "Sensors" },
  { id: 10, title: "Crankshaft and Camshaft Position Sensors And Engine Timing", category: "Sensors" },
  // OBD2
  { id: 13, title: "Top 10 Most Common OBD2 Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners Properly", category: "OBD2" },
  { id: 15, title: "Guide to Advanced OBD2 Live Data And Freeze Frame", category: "OBD2" },
  { id: 16, title: "How to Clear OBD2 Codes After A Car Repair", category: "OBD2" },
  // Alerts
  { id: 19, title: "What to Do When Your Dashboard Warning Lights On", category: "Alerts" },
  { id: 20, title: "Understanding Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  { id: 21, title: "Decoding Your Car's ABS And Traction Control Lights", category: "Alerts" },
  { id: 22, title: "Why Your Car's Battery And Alternator Lights Matter", category: "Alerts" },
  // Apps
  { id: 25, title: "Top Car Diagnostic Mobile Apps For Android And iOS", category: "Apps" },
  { id: 26, title: "How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "Comparing The Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  // Maintenance
  { id: 31, title: "Essential DIY Car Maintenance Tips For Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist For Vehicles", category: "Maintenance" },
  { id: 33, title: "How to Check And Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "The Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
  // Fuel
  { id: 37, title: "Simple Ways to Maximize Your Car's Fuel Economy Now", category: "Fuel" },
  { id: 38, title: "Troubleshooting The Most Common Fuel System Problems Cars", category: "Fuel" },
  { id: 39, title: "How To Know If You Have A Clogged Filter", category: "Fuel" },
  { id: 40, title: "Understanding The Differences Between Gasoline Grades And Ratings", category: "Fuel" },
  // EVs
  { id: 43, title: "A Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles", category: "EVs" },
  { id: 46, title: "Common Maintenance Tasks For Your New Electric Vehicle", category: "EVs" },
  // Trends
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, "title": "Exploring Latest Innovations In Today's Connected Car Technologies", "category": "Trends" },
  { id: 51, "title": "How Over-the-Air Updates Are Changing Modern Car Ownership", "category": "Trends" },
  { id: 52, "title": "The Rise of Autonomous Driving And Its Safety Features", "category": "Trends" },
];

const cacheDir = path.join(process.cwd(), '.cache', 'articles');
let generationLock = false;

async function ensureCacheDir() {
  try {
    await fs.mkdir(cacheDir, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

async function writeToCache(slug: string, data: FullArticle): Promise<void> {
  await ensureCacheDir();
  const filePath = path.join(cacheDir, `${slug}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function readFromCache(slug: string): Promise<FullArticle | null> {
  await ensureCacheDir();
  const filePath = path.join(cacheDir, `${slug}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as FullArticle;
  } catch (error) {
    return null;
  }
}

async function generateAndCacheArticle(topic: ArticleTopic): Promise<FullArticle> {
  console.log(`Generating article for topic: "${topic.title}"`);
  const slug = slugify(`${topic.title}-${topic.id}`);

  // Check cache first
  const cachedArticle = await readFromCache(slug);
  if (cachedArticle) {
    console.log(`Article "${topic.title}" found in cache.`);
    return cachedArticle;
  }

  // If not in cache, generate
  const generatedData = await generateArticle({ topic: topic.title, category: topic.category });

  const newArticle: FullArticle = {
    ...topic,
    slug,
    ...generatedData,
  };
  
  await writeToCache(slug, newArticle);
  console.log(`Article "${topic.title}" generated and cached.`);
  return newArticle;
}

export async function getLiveArticles(
  category: string | null,
  count: number
): Promise<FullArticle[]> {

  // Prevent multiple concurrent generation requests
  if (generationLock) {
    console.log("Generation is already in progress. Waiting...");
    // A simple wait mechanism
    await new Promise(resolve => setTimeout(resolve, 5000));
    // After waiting, recursively call to try again
    return getLiveArticles(category, count);
  }

  generationLock = true;
  
  try {
    const relevantTopics = category
    ? allArticleTopics.filter(t => t.category.toLowerCase() === category.toLowerCase())
    : allArticleTopics;

    // Shuffle and pick `count` random topics
    const selectedTopics = relevantTopics.sort(() => 0.5 - Math.random()).slice(0, count);

    if (selectedTopics.length === 0) {
      console.warn(`No topics found for category: ${category}`);
      return [];
    }

    const articlePromises = selectedTopics.map(topic => generateAndCacheArticle(topic));
    const articles = await Promise.all(articlePromises);
    
    return articles;
  } catch (error) {
    console.error("An error occurred during article generation:", error);
    return []; // Return empty array on error to prevent site crash
  } finally {
    generationLock = false; // Release the lock
  }
}

export async function getAllCachedArticles(): Promise<FullArticle[]> {
  await ensureCacheDir();
  const files = await fs.readdir(cacheDir);
  const articlePromises = files
    .filter(file => file.endsWith('.json'))
    .map(file => readFromCache(file.replace('.json', '')));
  
  const articles = await Promise.all(articlePromises);
  // Filter out any nulls in case of read errors and sort by ID descending
  return (articles.filter(a => a) as FullArticle[]).sort((a,b) => b.id - a.id);
}

export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    return readFromCache(slug);
}

export async function getAllArticleSlugs(): Promise<string[]> {
    await ensureCacheDir();
    const files = await fs.readdir(cacheDir);
    return files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
}
