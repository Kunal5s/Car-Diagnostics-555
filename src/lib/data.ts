
'use server';

import type { ArticleTopic, FullArticle } from './definitions';
import { slugify } from "./utils";
import { promises as fs } from 'fs';
import path from 'path';

// This is the static list of all topics. It serves as the foundation of our site.
// Every article in this list is expected to have a corresponding pre-generated JSON file in the cache.
const allArticleTopics: Omit<ArticleTopic, 'slug' | 'imageUrl' | 'status'>[] = [
  // Engine
  { id: 1, title: "Advanced Diagnostic Techniques for Modern Common Engine Performance Issues", category: "Engine" },
  { id: 2, title: "A Comprehensive Step-by-Step Guide for Resolving Engine Overheating", category: "Engine" },
  { id: 3, title: "Understanding the Critical Importance of Replacing Your Car's Timing Belt", category: "Engine" },
  { id: 4, title: "The Top Five Most Common Reasons Your Check Engine Light is On", category: "Engine" },
  // Sensors
  { id: 5, title: "A Complete Do-It-Yourself Guide to Testing and Replacing Faulty Automotive Sensors", category: "Sensors" },
  { id: 6, title: "The Essential Role and Function of Oxygen Sensors in Modern Vehicles", category: "Sensors" },
  { id: 7, title: "How to Properly Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors" },
  { id: 8, title: "Understanding Crankshaft and Camshaft Position Sensors and Their Relationship", category: "Sensors" },
  // OBD2
  { id: 9, title: "A Beginner’s Guide to Using OBD2 Scanners for Car Diagnostics", category: "OBD2" },
  { id: 10, title: "Unlocking Advanced Live Data and Freeze Frame with OBD2 Scanners", category: "OBD2" },
  { id: 11, title: "The Correct Procedure for Clearing OBD2 Codes After Vehicle Repair", category: "OBD2" },
  { id: 12, title: "Using Modern Bluetooth OBD2 Scanners with Your Android or iOS Smartphone", category: "OBD2" },
  // Alerts
  { id: 13, title: "A Detailed Guide to Decoding Your Car's ABS and Traction Control Lights", category: "Alerts" },
  { id: 14, title: "A Guide to Understanding Why Your Car's Battery and Alternator Lights Matter", category: "Alerts" },
  { id: 15, title: "What to Do When Your Dashboard Warning Lights Come On", category: "Alerts" },
  { id: 16, title: "How to Correctly Respond to a Flashing Check Engine Light on Your Dashboard", category: "Alerts" },
  // Apps
  { id: 17, title: "A Review of the Top Car Diagnostic Mobile Apps for iOS and Android", category: "Apps" },
  { id: 18, title: "How Modern Car Diagnostic Apps Can Save You Hundreds on Repairs", category: "Apps" },
  { id: 19, title: "Using Car Apps to Diligently Track Maintenance and Overall Vehicle Health", category: "Apps" },
  { id: 20, title: "A Step-by-Step Guide on Connecting Your Car to a Diagnostic App", category: "Apps" },
  // Maintenance
  { id: 21, title: "Essential DIY Car Maintenance Tips for Every Responsible Car Owner", category: "Maintenance" },
  { id: 22, title: "How to Properly Check and Change Your Car's Most Essential Fluids", category: "Maintenance" },
  { id: 23, title: "The Critical Importance of Regular Brake System Inspection and Proper Maintenance", category: "Maintenance" },
  { id: 24, title: "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
  // Fuel
  { id: 25, title: "Simple and Effective Ways to Maximize Your Car's Overall Fuel Economy", category: "Fuel" },
  { id: 26, title: "Troubleshooting the Most Common Fuel System Problems in Modern Cars", category: "Fuel" },
  { id: 27, title: "How to Know for Sure if You Have a Clogged Fuel Filter", category: "Fuel" },
  { id: 28, title: "A Guide to Diagnosing a Malfunctioning or Failing Modern Fuel Injector", category: "Fuel" },
  // EVs
  { id: 29, title: "A Complete Guide to Electric Vehicle Battery Health and Longevity Maintenance", category: "EVs" },
  { id: 30, title: "Everything You Need to Know About Practical EV Home Charging Solutions", category: "EVs" },
  { id: 31, title: "How Regenerative Braking Works in Modern Electric Vehicles to Save Energy", category: "EVs" },
  { id: 32, title: "The Key Differences Between AC and DC Fast Charging for Electric Vehicles", category: "EVs" },
  // Trends
  { id: 33, title: "The Exciting Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 34, "title": "How Over-the-Air Software Updates Are Changing Modern Car Ownership Experience", category: "Trends" },
  { id: 35, "title": "Vehicle-to-Everything (V2X) Communication and the Future of Driving Safety", category: "Trends" },
  { id: 36, "title": "Understanding the Important Role of Big Data In Modern Connected Vehicles", category: "Trends" }
];

const CACHE_DIR = path.join(process.cwd(), '.cache', 'articles');

/**
 * Retrieves a single article by its slug from the file-based cache.
 * Returns null if the article is not found in the cache.
 * This function NO LONGER generates content on the fly.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
    try {
        const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
        const article: FullArticle = JSON.parse(cachedData);
        // Ensure the article from cache is considered ready
        if (article.status === 'ready' && article.imageUrl && !article.imageUrl.includes('placehold.co')) {
             return article;
        }
        return null; // Don't return articles that aren't ready
    } catch (error: any) {
        // If file doesn't exist, it's not an error, just a cache miss.
        if (error.code !== 'ENOENT') {
            console.error(`[Cache] Error reading file for ${slug}:`, error);
        }
        return null;
    }
}


/**
 * Gets all topics that have a corresponding, valid, and "ready" cache file.
 * This function drives the entire site's content.
 */
export async function getAllTopics(): Promise<ArticleTopic[]> {
  const topicsWithSlugs = allArticleTopics.map(topic => ({
    ...topic,
    slug: `${slugify(topic.title)}-${topic.id}`,
  }));

  const topicPromises = topicsWithSlugs.map(async (topic) => {
    const article = await getArticleBySlug(topic.slug);
    if (article) {
      return {
        ...topic,
        imageUrl: article.imageUrl,
        status: 'ready' as const,
      };
    }
    return null; // Topic is not ready, so we filter it out.
  });

  const allReadyTopics = (await Promise.all(topicPromises)).filter(Boolean) as ArticleTopic[];
  
  return allReadyTopics;
}


export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  
  // Use a deterministic shuffle based on the current day to keep the list stable for 24 hours.
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const seed = now.getFullYear() * 1000 + dayOfYear;
  
  function seededShuffle(array: any[], seed: number) {
      let currentIndex = array.length, temporaryValue, randomIndex;
      const random = () => {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };
      while (0 !== currentIndex) {
        randomIndex = Math.floor(random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
  }

  const shuffledTopics = seededShuffle([...topics], seed);
  return shuffledTopics.slice(0, 4);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const allReadyTopics = await getAllTopics();
  const categoryTopics = allReadyTopics.filter(topic => topic.category.toLowerCase() === categoryName.toLowerCase());

  // Return the first 4 available articles for that category
  return categoryTopics.slice(0, 4);
}
