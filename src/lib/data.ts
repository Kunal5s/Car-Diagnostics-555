
'use server';

import type { ArticleTopic, FullArticle } from './definitions';
import { slugify } from "./utils";
import { promises as fs } from 'fs';
import path from 'path';

// This is the static, complete list of all topics for the site.
const allArticleTopics: Omit<ArticleTopic, 'slug' | 'imageUrl' | 'status'>[] = [
    { id: 101, title: "The Ultimate Guide to Engine Diagnostics", category: "Engine" },
    { id: 102, title: "Solving Engine Overheating: A Step-by-Step Manual", category: "Engine" },
    { id: 103, title: "Why Your Timing Belt is Critical for Engine Health", category: "Engine" },
    { id: 4, title: "The Top Five Most Common Reasons Your Check Engine Light is On", category: "Engine" },
    { id: 201, title: "DIY Guide: Testing and Replacing Automotive Sensors", category: "Sensors" },
    { id: 6, title: "The Essential Role and Function of Oxygen Sensors in Modern Vehicles", category: "Sensors" },
    { id: 7, title: "How to Properly Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors" },
    { id: 8, title: "Understanding Crankshaft and Camshaft Position Sensors and Their Relationship", category: "Sensors" },
    { id: 301, title: "Getting Started with OBD2 Scanners for Diagnostics", category: "OBD2" },
    { id: 10, title: "Unlocking Advanced Live Data and Freeze Frame with OBD2 Scanners", category: "OBD2" },
    { id: 11, title: "The Correct Procedure for Clearing OBD2 Codes After Vehicle Repair", category: "OBD2" },
    { id: 12, title: "Using Modern Bluetooth OBD2 Scanners with Your Android or iOS Smartphone", category: "OBD2" },
    { id: 13, title: "A Detailed Guide to Decoding Your Car's ABS and Traction Control Lights", category: "Alerts" },
    { id: 14, title: "A Guide to Understanding Why Your Car's Battery and Alternator Lights Matter", category: "Alerts" },
    { id: 15, title: "What to Do When Your Dashboard Warning Lights Come On", category: "Alerts" },
    { id: 16, title: "How to Correctly Respond to a Flashing Check Engine Light on Your Dashboard", category: "Alerts" },
    { id: 17, title: "A Review of the Top Car Diagnostic Mobile Apps for iOS and Android", category: "Apps" },
    { id: 18, title: "How Modern Car Diagnostic Apps Can Save You Hundreds on Repairs", category: "Apps" },
    { id: 19, title: "Using Car Apps to Diligently Track Maintenance and Overall Vehicle Health", category: "Apps" },
    { id: 20, title: "A Step-by-Step Guide on Connecting Your Car to a Diagnostic App", category: "Apps" },
    { id: 21, title: "Essential DIY Car Maintenance Tips for Every Responsible Car Owner", category: "Maintenance" },
    { id: 22, title: "How to Properly Check and Change Your Car's Most Essential Fluids", category: "Maintenance" },
    { id: 23, title: "The Critical Importance of Regular Brake System Inspection and Proper Maintenance", category: "Maintenance" },
    { id: 24, title: "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
    { id: 25, title: "Simple and Effective Ways to Maximize Your Car's Overall Fuel Economy", category: "Fuel" },
    { id: 26, title: "Troubleshooting the Most Common Fuel System Problems in Modern Cars", category: "Fuel" },
    { id: 27, title: "How to Know for Sure if You Have a Clogged Fuel Filter", category: "Fuel" },
    { id: 28, title: "A Guide to Diagnosing a Malfunctioning or Failing Modern Fuel Injector", category: "Fuel" },
    { id: 29, title: "A Complete Guide to Electric Vehicle Battery Health and Longevity Maintenance", category: "EVs" },
    { id: 30, title: "Everything You Need to Know About Practical EV Home Charging Solutions", category: "EVs" },
    { id: 31, title: "How Regenerative Braking Works in Modern Electric Vehicles to Save Energy", category: "EVs" },
    { id: 32, title: "The Key Differences Between AC and DC Fast Charging for Electric Vehicles", category: "EVs" },
    { id: 33, title: "The Exciting Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
    { id: 34, title: "How Over-the-Air Software Updates Are Changing Modern Car Ownership Experience", category: "Trends" },
    { id: 35, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving Safety", category: "Trends" },
    { id: 36, title: "Understanding the Important Role of Big Data In Modern Connected Vehicles", category: "Trends" },
];

const CACHE_DIR = path.join(process.cwd(), '.cache', 'articles');

/**
 * Retrieves a single article from the file cache.
 * @param slug The slug of the article to retrieve.
 * @returns A FullArticle object or null if not found.
 */
async function getArticleFromCache(slug: string): Promise<FullArticle | null> {
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
    try {
        await fs.access(cacheFilePath);
        const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
        const article = JSON.parse(cachedData) as FullArticle;
        
        // Ensure essential fields exist and are valid.
        if (article.slug && article.content && article.summary) {
            return article;
        }
        console.warn(`[Cache Warning] Corrupt data for slug: ${slug}.`);
        return null;
    } catch (error) {
        // This is now an expected case if a cache file doesn't exist.
        return null;
    }
}

/**
 * Provides the full list of all article topics with their generated slugs.
 * This is used for building static pages and sitemaps.
 */
export async function getAllTopics(): Promise<ArticleTopic[]> {
    return allArticleTopics.map(topic => {
        const slug = `${slugify(topic.title)}-${topic.id}`;
        return {
            ...topic,
            slug,
            imageUrl: null, // Default value, will be populated from cache.
            status: 'pending' // Default value, will be populated from cache.
        };
    });
}

/**
 * Gets a single article by its slug. It will only read from the pre-generated cache.
 * If an article is not in the cache, it returns a placeholder object.
 * @param slug The slug of the article.
 * @returns A FullArticle object.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const cachedArticle = await getArticleFromCache(slug);

    if (cachedArticle) {
        console.log(`[Cache Hit] Serving article from cache for slug: ${slug}`);
        return cachedArticle;
    }

    // If not in cache, find the base topic information to create a placeholder.
    const baseTopic = allArticleTopics.find(t => `${slugify(t.title)}-${t.id}` === slug);
    if (!baseTopic) {
        return null; // The slug doesn't correspond to any known topic.
    }
    
    console.warn(`[Cache Miss] No cache file found for slug: ${slug}. Serving placeholder content.`);
    return {
        ...baseTopic,
        slug,
        summary: "This article is not available at the moment. Please check back later.",
        content: "## Content Not Available\n\nThis article's content has not been generated or is currently unavailable. Please ensure the cache files in `.cache/articles/` are present and valid.",
        imageUrl: `https://placehold.co/600x400.png`,
        status: 'pending'
    };
}

/**
 * Gets a random selection of articles for display on grid pages.
 * This function now only relies on the pre-generated file cache.
 * @param count The number of articles to return.
 * @param category Optional category to filter by.
 * @returns An array of FullArticle objects.
 */
export async function getLiveArticles(count: number, category?: string): Promise<FullArticle[]> {
    let candidateTopics = [...allArticleTopics];
    if (category) {
        candidateTopics = candidateTopics.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    // Shuffle the topics to ensure randomness.
    for (let i = candidateTopics.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidateTopics[i], candidateTopics[j]] = [candidateTopics[j], candidateTopics[i]];
    }

    const selectedTopics = candidateTopics.slice(0, count);

    const articlePromises = selectedTopics.map(topic => {
        const slug = `${slugify(topic.title)}-${topic.id}`;
        return getArticleBySlug(slug);
    });

    const articles = await Promise.all(articlePromises);
    
    // Filter out any nulls that might have occurred.
    return articles.filter((article): article is FullArticle => article !== null);
}
