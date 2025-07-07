
'use server';

import type { ArticleTopic, FullArticle } from './definitions';
import { slugify } from "./utils";
import { promises as fs } from 'fs';
import path from 'path';

// This is the new, static list of all 32 topics (4 per category).
// Every article in this list has a corresponding pre-generated JSON file in the cache.
const allArticleTopics: Omit<ArticleTopic, 'slug' | 'imageUrl' | 'status'>[] = [
  // Engine
  { id: 101, title: "The Ultimate Guide to Engine Diagnostics", category: "Engine" },
  { id: 102, title: "Solving Engine Overheating: A Step-by-Step Manual", category: "Engine" },
  { id: 103, title: "Why Your Timing Belt is Critical for Engine Health", category: "Engine" },
  { id: 104, title: "Decoding the Check Engine Light: Top 5 Causes", category: "Engine" },
  // Sensors
  { id: 201, title: "DIY Guide: Testing and Replacing Automotive Sensors", category: "Sensors" },
  { id: 202, title: "Oxygen Sensors Explained: Role and Function in Modern Cars", category: "Sensors" },
  { id: 203, title: "How to Clean Your MAF Sensor for Peak Performance", category: "Sensors" },
  { id: 204, title: "The Relationship Between Crankshaft and Camshaft Sensors", category: "Sensors" },
  // OBD2
  { id: 301, title: "Getting Started with OBD2 Scanners for Diagnostics", category: "OBD2" },
  { id: 302, title: "Using Live Data and Freeze Frame on OBD2 Scanners", category: "OBD2" },
  { id: 303, title: "The Right Way to Clear OBD2 Codes After a Repair", category: "OBD2" },
  { id: 304, title: "Connecting Bluetooth OBD2 Scanners to Your Smartphone", category: "OBD2" },
  // Alerts
  { id: 401, title: "What Your ABS and Traction Control Lights Really Mean", category: "Alerts" },
  { id: 402, title: "Understanding Your Car's Battery and Alternator Lights", category: "Alerts" },
  { id: 403, title: "A Guide to Your Car's Dashboard Warning Lights", category: "Alerts" },
  { id: 404, title: "How to React to a Flashing Check Engine Light", category: "Alerts" },
  // Apps
  { id: 501, title: "The Best Car Diagnostic Apps for iOS and Android in 2024", category: "Apps" },
  { id: 502, title: "Save Money on Repairs with Modern Car Diagnostic Apps", category: "Apps" },
  { id: 503, title: "Track Vehicle Health and Maintenance with Car Apps", category: "Apps" },
  { id: 504, title: "How to Connect Your Car to a Diagnostic App", category: "Apps" },
  // Maintenance
  { id: 601, title: "Essential Car Maintenance Tips for Every DIY Owner", category: "Maintenance" },
  { id: 602, title: "Checking and Changing Your Car's Essential Fluids", category: "Maintenance" },
  { id: 603, title: "The Importance of Regular Brake System Maintenance", category: "Maintenance" },
  { id: 604, title: "When and Why to Replace Your Car's Battery", category: "Maintenance" },
  // Fuel
  { id: 701, title: "Effective Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
  { id: 702, title: "Troubleshooting Common Fuel System Problems", category: "Fuel" },
  { id: 703, title: "How to Tell if Your Fuel Filter is Clogged", category: "Fuel" },
  { id: 704, title: "Diagnosing a Failing Modern Fuel Injector", category: "Fuel" },
  // EVs
  { id: 801, title: "EV Battery Health and Longevity: A Complete Guide", category: "EVs" },
  { id: 802, title: "Practical Home Charging Solutions for Your EV", category: "EVs" },
  { id: 803, title: "How Regenerative Braking Boosts EV Efficiency", category: "EVs" },
  { id: 804, title: "AC vs DC Fast Charging: What's the Difference?", category: "EVs" },
];

const CACHE_DIR = path.join(process.cwd(), '.cache', 'articles');

/**
 * Retrieves a single article by its slug from the file-based cache.
 * All articles are pre-generated, so this function is fast and reliable.
 */
export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
    try {
        const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
        const article: FullArticle = JSON.parse(cachedData);
        // All articles in the cache are considered ready.
        return article;
    } catch (error) {
        // If a file for a known slug doesn't exist, it's a critical error.
        console.error(`[Cache Error] Failed to read pre-generated article for slug: ${slug}`, error);
        return null;
    }
}


/**
 * Gets all topics that have a corresponding, valid cache file.
 * In this new model, all topics are expected to have a cache file.
 */
export async function getAllTopics(): Promise<ArticleTopic[]> {
  const topicsWithSlugs = allArticleTopics.map(topic => ({
    ...topic,
    slug: `${slugify(topic.title)}-${topic.id}`,
    // Since all content is pre-generated, all topics are 'ready'.
    // The imageUrl is set to null as requested for the "white preview".
    status: 'ready' as const,
    imageUrl: null,
  }));

  return topicsWithSlugs;
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

  // Return exactly 4 articles for the category
  return categoryTopics.slice(0, 4);
}
