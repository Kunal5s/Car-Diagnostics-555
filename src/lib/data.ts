
'use server';

import type { ArticleTopic, FullArticle } from './definitions';
import { slugify } from "./utils";
import { promises as fs } from 'fs';
import path from 'path';
import { generateArticle } from '@/ai/flows/generate-article';
import { generateImage } from '@/ai/flows/generate-image';
import { Octokit } from "@octokit/rest";
import sharp from 'sharp';

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
    { id: 24, "title": "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
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
];

const CACHE_DIR = path.join(process.cwd(), '.cache', 'articles');

async function ensureCacheDirExists() {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    } catch (error) {
        console.error("Could not create cache directory:", error);
    }
}

async function uploadImageToGitHub(base64Data: string, slug: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("[GitHub Upload] GITHUB_TOKEN is not set.");
    throw new Error("Server configuration error: Missing GitHub token.");
  }

  const octokit = new Octokit({ auth: token });
  const owner = 'kunal5s';
  const repo = 'ai-blog-images';
  const imagePath = `public/images/${slug}.jpg`;
  
  // Compress image and convert to JPEG buffer
  const buffer = await sharp(Buffer.from(base64Data, 'base64'))
    .jpeg({ quality: 80 })
    .toBuffer();

  // Convert buffer to base64 string for GitHub API
  const content = buffer.toString('base64');
  
  try {
    // Check if the file already exists
    try {
      await octokit.repos.getContent({
        owner,
        repo,
        path: imagePath,
      });
      // If it exists, we don't need to re-upload. Just return the known URL.
      console.log(`[GitHub Upload] Image already exists for slug: ${slug}. Using existing URL.`);
    } catch (error: any) {
      if (error.status === 404) {
        // File does not exist, so we upload it.
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: imagePath,
          message: `feat: Add image for ${slug}`,
          content: content,
        });
        console.log(`[GitHub Upload] Successfully uploaded image for slug: ${slug}`);
      } else {
        // Some other error occurred when checking for the file.
        throw error;
      }
    }
  } catch (error: any) {
     console.error(`[GitHub Upload] Failed to upload image for ${slug}:`, error.message);
     // If it fails after checking, it might be a race condition or other issue.
     // We'll proceed assuming it's there or returning the raw URL.
  }
  
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/${imagePath}`;
}


export async function getAllTopics(): Promise<ArticleTopic[]> {
    await ensureCacheDirExists();
    const topicsWithSlugs = allArticleTopics.map(topic => ({
      ...topic,
      slug: `${slugify(topic.title)}-${topic.id}`,
      status: 'pending' as const,
      imageUrl: null,
    }));

    for (const topic of topicsWithSlugs) {
        const cacheFilePath = path.join(CACHE_DIR, `${topic.slug}.json`);
        try {
            await fs.access(cacheFilePath);
            const fileContent = await fs.readFile(cacheFilePath, 'utf-8');
            const parsedContent: FullArticle = JSON.parse(fileContent);
            if (parsedContent.content && !parsedContent.content.includes("Error") && parsedContent.imageUrl) {
               topic.status = 'ready';
               topic.imageUrl = parsedContent.imageUrl;
            }
        } catch (error) {
            // File doesn't exist, status remains pending.
        }
    }
    return topicsWithSlugs;
}

export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    await ensureCacheDirExists();
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);

    try {
        const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
        const parsedArticle = JSON.parse(cachedData) as FullArticle;
        if (parsedArticle.content.includes("Error") || !parsedArticle.imageUrl) {
            throw new Error("Cached article is incomplete or contains an error.");
        }
        return parsedArticle;
    } catch (error) {
        console.log(`[On-Demand Gen] Cache miss for slug: ${slug}. Generating article and image.`);

        const topic = allArticleTopics.find(t => `${slugify(t.title)}-${t.id}` === slug);
        if (!topic) {
            console.error(`[On-Demand Gen] No topic found for slug: ${slug}`);
            return null;
        }

        try {
            const generatedData = await generateArticle({ topic: topic.title });
            const imageData = await generateImage({ topic: topic.title });
            const imageUrl = await uploadImageToGitHub(imageData.base64, slug);

            const newArticle: FullArticle = {
                id: topic.id,
                title: topic.title,
                category: topic.category,
                slug: slug,
                summary: generatedData.summary,
                content: generatedData.content,
                status: 'ready',
                imageUrl: imageUrl,
            };

            await fs.writeFile(cacheFilePath, JSON.stringify(newArticle, null, 2));
            console.log(`[On-Demand Gen] Successfully generated and cached article: ${slug}`);
            return newArticle;

        } catch (generationError: any) {
            console.error(`[On-Demand Gen] FAILED to generate article/image for slug: ${slug}`, generationError);
            
            // Return an error object but don't cache it, so it can be retried.
            return {
                id: topic.id,
                title: topic.title,
                category: topic.category,
                slug: slug,
                summary: "Article generation failed.",
                content: `<h2>Error Generating Article</h2><p>We were unable to generate this article at the moment due to an error: ${generationError.message}</p><p>Please try again later.</p>`,
                status: 'pending',
                imageUrl: null,
            };
        }
    }
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
  const categoryTopics = allTopics.filter(topic => topic.category.toLowerCase() === categoryName.toLowerCase());
  return categoryTopics.slice(0, 4);
}
