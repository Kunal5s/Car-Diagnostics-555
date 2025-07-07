
'use server';

import type { ArticleTopic, FullArticle } from './definitions';
import { slugify } from "./utils";
import { promises as fs } from 'fs';
import path from 'path';
import { generateArticle } from '@/ai/flows/generate-article';
import { generateImage } from '@/ai/flows/generate-image';
import { uploadImageToGitHub } from './github';

const allArticleTopics: Omit<ArticleTopic, 'slug' | 'imageUrl' | 'status'>[] = [
    { id: 101, title: "The Ultimate Guide to Engine Diagnostics", category: "Engine" },
    { id: 102, title: "Solving Engine Overheating: A Step-by-Step Manual", category: "Engine" },
    { id: 103, title: "Why Your Timing Belt is Critical for Engine Health", category: "Engine" },
    { id: 104, title: "Decoding the Check Engine Light: Top 5 Causes", category: "Engine" },
    { id: 201, title: "DIY Guide: Testing and Replacing Automotive Sensors", category: "Sensors" },
    { id: 202, title: "Oxygen Sensors Explained: Role and Function in Modern Cars", category: "Sensors" },
    { id: 203, title: "How to Clean Your MAF Sensor for Peak Performance", category: "Sensors" },
    { id: 204, title: "The Relationship Between Crankshaft and Camshaft Sensors", category: "Sensors" },
    { id: 301, title: "Getting Started with OBD2 Scanners for Diagnostics", category: "OBD2" },
    { id: 302, title: "Using Live Data and Freeze Frame on OBD2 Scanners", category: "OBD2" },
    { id: 303, title: "The Right Way to Clear OBD2 Codes After a Repair", category: "OBD2" },
    { id: 304, title: "Connecting Bluetooth OBD2 Scanners to Your Smartphone", category: "OBD2" },
    { id: 401, title: "What Your ABS and Traction Control Lights Really Mean", category: "Alerts" },
    { id: 402, title: "Understanding Your Car's Battery and Alternator Lights", category: "Alerts" },
    { id: 403, title: "A Guide to Your Car's Dashboard Warning Lights", category: "Alerts" },
    { id: 404, title: "How to React to a Flashing Check Engine Light", category: "Alerts" },
    { id: 501, title: "The Best Car Diagnostic Apps for iOS and Android in 2024", category: "Apps" },
    { id: 502, title: "Save Money on Repairs with Modern Car Diagnostic Apps", category: "Apps" },
    { id: 503, title: "Track Vehicle Health and Maintenance with Car Apps", category: "Apps" },
    { id: 504, title: "How to Connect Your Car to a Diagnostic App", category: "Apps" },
    { id: 601, title: "Essential Car Maintenance Tips for Every DIY Owner", category: "Maintenance" },
    { id: 602, title: "Checking and Changing Your Car's Essential Fluids", category: "Maintenance" },
    { id: 603, title: "The Importance of Regular Brake System Maintenance", category: "Maintenance" },
    { id: 604, title: "When and Why to Replace Your Car's Battery", category: "Maintenance" },
    { id: 701, title: "Effective Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
    { id: 702, title: "Troubleshooting Common Fuel System Problems", category: "Fuel" },
    { id: 703, title: "How to Tell if Your Fuel Filter is Clogged", category: "Fuel" },
    { id: 704, title: "Diagnosing a Failing Modern Fuel Injector", category: "Fuel" },
    { id: 801, title: "EV Battery Health and Longevity: A Complete Guide", category: "EVs" },
    { id: 802, title: "Practical Home Charging Solutions for Your EV", category: "EVs" },
    { id: 803, title: "How Regenerative Braking Boosts EV Efficiency", category: "EVs" },
    { id: 804, title: "AC vs DC Fast Charging: What's the Difference?", category: "EVs" },
    { id: 33, title: "The Exciting Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
    { id: 34, title: "How Over-the-Air Software Updates Are Changing Modern Car Ownership Experience", category: "Trends" },
    { id: 35, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving Safety", category: "Trends" },
    { id: 36, title: "Understanding the Important Role of Big Data In Modern Connected Vehicles", category: "Trends" },
];

const CACHE_DIR = path.join(process.cwd(), '.cache', 'articles');


async function getArticleFromCache(slug: string): Promise<Omit<FullArticle, 'icon'> | null> {
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
    try {
        await fs.access(cacheFilePath);
        const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
        return JSON.parse(cachedData) as Omit<FullArticle, 'icon'>;
    } catch (error) {
        return null;
    }
}

export async function updateArticleCache(slug: string, articleData: Partial<Omit<FullArticle, 'icon'>>): Promise<void> {
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
        
        let existingData: Partial<Omit<FullArticle, 'icon'>> = {};
        try {
            const fileContent = await fs.readFile(cacheFilePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        } catch (readError) {
            // File doesn't exist, which is fine.
        }

        const dataToWrite = { ...existingData, ...articleData };
        await fs.writeFile(cacheFilePath, JSON.stringify(dataToWrite, null, 2), 'utf-8');

    } catch (error) {
        console.error(`[Cache Error] Could not write cache file for slug: ${slug}.`, error);
        throw error;
    }
}

export async function getAllTopics(): Promise<ArticleTopic[]> {
    const topicsWithSlugs = allArticleTopics.map(topic => ({
      ...topic,
      slug: `${slugify(topic.title)}-${topic.id}`,
    }));

    const populatedTopics = await Promise.all(
        topicsWithSlugs.map(async (topic) => {
            const cachedArticle = await getArticleFromCache(topic.slug);
            return {
                ...topic,
                status: (cachedArticle && cachedArticle.content) ? 'ready' : 'pending', 
                imageUrl: cachedArticle?.imageUrl || null,
            };
        })
    );
    
    return populatedTopics;
}

export async function getArticleBySlug(slug: string): Promise<Omit<FullArticle, 'icon'> | null> {
    const baseTopic = allArticleTopics.find(t => `${slugify(t.title)}-${t.id}` === slug);
    if (!baseTopic) return null;

    let cachedArticle = await getArticleFromCache(slug);

    // If article is not in cache, generate it
    if (!cachedArticle?.content || !cachedArticle?.imageUrl) {
        console.log(`[Cache Miss] Generating article for slug: ${slug}`);
        try {
            const articleContent = await generateArticle({ topic: baseTopic.title });
            
            // Check for valid content before proceeding
            if (!articleContent.content || articleContent.content.length < 500) {
                 throw new Error("Generated content is too short or invalid.");
            }
            
            await updateArticleCache(slug, { ...baseTopic, slug, ...articleContent, status: 'ready' });

            // Now that content is generated and cached, generate the image.
            // This is done separately to ensure content is saved first.
            const imageResult = await generateImage({ topic: baseTopic.title });
            if (imageResult?.base64) {
                 const imageUrl = await uploadImageToGitHub(imageResult.base64, `${slug}.webp`);
                 if (imageUrl) {
                    await updateArticleCache(slug, { imageUrl });
                 }
            }
            
            // Re-fetch from cache to have the most up-to-date version
            cachedArticle = await getArticleFromCache(slug);

        } catch (error) {
            console.error(`[Generation Error] Failed to generate article for slug ${slug}:`, error);
            // Return base topic info so the page doesn't crash
            return {
                ...baseTopic,
                slug,
                summary: 'Error generating article.',
                content: `## Article Generation Failed\n\nWe were unable to generate this article at this time. Please try again later. Error: ${error instanceof Error ? error.message : String(error)}`,
                imageUrl: null,
                status: 'pending',
            };
        }
    }

    return {
      ...baseTopic,
      slug: slug,
      summary: cachedArticle?.summary || '',
      content: cachedArticle?.content || '',
      imageUrl: cachedArticle?.imageUrl || null,
      status: (cachedArticle && cachedArticle.content) ? 'ready' : 'pending',
    };
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
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
  const allTopics = await getAllTopics();
  return allTopics.filter(topic => topic.category.toLowerCase() === categoryName.toLowerCase());
}
