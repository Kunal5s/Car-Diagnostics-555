
'use server';

import 'dotenv/config';
import type { ArticleTopic, FullArticle } from './definitions';
import { slugify } from "./utils";
import { generateArticle } from "@/ai/flows/generate-article";
import { promises as fs } from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import sharp from 'sharp';

// Configuration for GitHub image repository
const GITHUB_OWNER = 'kunal5s';
const GITHUB_REPO = 'ai-blog-images';
const GITHUB_BRANCH = 'main';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// This is the static list of all topics. It serves as the foundation of our site.
// There are 4 unique topics per category.
const allArticleTopics: Omit<ArticleTopic, 'slug' | 'imageUrl'>[] = [
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
  { id: 15, title: "A Guide to Understanding the Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
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
  { id: 34, title: "How Over-the-Air Software Updates Are Changing Modern Car Ownership Experience", category: "Trends" },
  { id: 35, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving Safety", category: "Trends" },
  { id: 36, "title": "Understanding the Important Role of Big Data In Modern Connected Vehicles", category: "Trends" }
];

function getFinalImageUrl(slug: string): string {
    return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/images/${slug}.jpg`;
}

async function generateAndUploadImage(slug: string, title: string, category: string): Promise<string | null> {
    if (!GITHUB_TOKEN) {
        console.error("[Image Gen] GITHUB_TOKEN is not set. Skipping image generation. Please check your .env file and restart the server.");
        return null;
    }

    const imagePath = `public/images/${slug}.jpg`;
    const prompt = `${title}, ${category}, photorealistic`;
    const imageModel = 'flux-realism';

    console.log(`[Image Gen] Starting image generation for "${title}"`);
    console.log(`[Image Gen]   - Prompt: "${prompt}"`);

    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 1000000);
        const pollutionsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${imageModel}&width=512&height=512&nologo=true&seed=${seed}`;
        
        console.log(`[Image Gen]   - Fetching from: ${pollutionsUrl}`);
        const response = await fetch(pollutionsUrl, { signal: AbortSignal.timeout(30000) }); // 30 second timeout
        if (!response.ok) {
            throw new Error(`Pollinations API request failed with status ${response.status}: ${await response.text()}`);
        }
        const imageBuffer = Buffer.from(await response.arrayBuffer());
        console.log(`[Image Gen]   - Image fetched successfully.`);

        console.log('[Image Gen]   - Compressing image...');
        const compressedBuffer = await sharp(imageBuffer)
            .resize(512, 512)
            .jpeg({ quality: 30 })
            .toBuffer();
        console.log(`[Image Gen]   - Image compressed. Size: ${Math.round(compressedBuffer.length / 1024)}KB`);

        console.log(`[Image Gen]   - Pushing to GitHub at path: ${imagePath}`);
        const commitMessage = `feat: add image for article ${slug}`;
        
        let sha: string | undefined;
        try {
            const { data } = await octokit.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: imagePath,
                ref: GITHUB_BRANCH,
            });
            if (typeof data === 'object' && !Array.isArray(data) && 'sha' in data) {
                 sha = data.sha;
            }
        } catch (error: any) {
            if (error.status !== 404) throw error;
        }

        await octokit.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: imagePath,
            message: commitMessage,
            content: compressedBuffer.toString('base64'),
            branch: GITHUB_BRANCH,
            sha,
        });

        const finalUrl = getFinalImageUrl(slug);
        console.log(`[Image Gen]   - ✅ Successfully uploaded image. URL: ${finalUrl}`);
        return finalUrl;

    } catch (err: any) {
        console.error(`[Image Gen] ❌ Failed to generate and upload image for "${title}":`, err.message);
        return null;
    }
}


export async function getAllTopics(): Promise<ArticleTopic[]> {
  return allArticleTopics.map(topic => {
      const slug = `${slugify(topic.title)}-${topic.id}`;
      return {
          ...topic,
          slug,
          imageUrl: getFinalImageUrl(slug)
      };
  });
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();

  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  
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
  return shuffledTopics.slice(0, 6);
}


export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const topics = await getAllTopics();
  return topics.filter(topic => topic.category.toLowerCase() === categoryName.toLowerCase());
}

const CACHE_DIR = path.join(process.cwd(), '.cache', 'articles');
const CACHE_TTL_HOURS = 24;

export async function getArticleBySlug(slug: string): Promise<FullArticle | null> {
    const staticTopic = allArticleTopics.find(topic => `${slugify(topic.title)}-${topic.id}` === slug);
    if (!staticTopic) {
        return null;
    }

    await fs.mkdir(CACHE_DIR, { recursive: true });
    const cacheFilePath = path.join(CACHE_DIR, `${slug}.json`);

    // 1. Check local file cache
    try {
        const stats = await fs.stat(cacheFilePath);
        const lastModified = stats.mtime;
        const now = new Date();
        const ageInHours = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60);

        if (ageInHours < CACHE_TTL_HOURS) {
            console.log(`[Cache] HIT for "${slug}". Loading from file.`);
            const cachedData = await fs.readFile(cacheFilePath, 'utf-8');
            const article: FullArticle = JSON.parse(cachedData);
            // Simple validation to ensure the cached content is not an error or missing an image
            if (article.content && !article.content.includes("Article Generation Failed") && article.imageUrl) {
                return article;
            }
            console.log(`[Cache] Stale or invalid cache for "${slug}". Regenerating.`);
        }
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error(`[Cache] Error reading cache file for ${slug}:`, error);
        }
        // If file doesn't exist (ENOENT), we continue to the generation logic.
    }
    
    console.log(`[Cache] MISS for "${slug}". Checking remote assets and generating if needed.`);

    // 2. If cache miss, check if image already exists on GitHub to avoid re-generating it
    const imagePath = `public/images/${slug}.jpg`;
    let finalImageUrl: string | null = null;

    try {
        await octokit.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: imagePath,
            ref: GITHUB_BRANCH,
        });
        finalImageUrl = getFinalImageUrl(slug);
        console.log(`[GitHub] Image already exists for "${slug}". Re-using it.`);
    } catch (error: any) {
        if (error.status === 404) {
            console.log(`[GitHub] Image does not exist for "${slug}". Generating new image.`);
            finalImageUrl = await generateAndUploadImage(slug, staticTopic.title, staticTopic.category);
        } else {
            console.error(`[GitHub] Error checking for image existence for "${slug}":`, error.message);
        }
    }

    // 3. Generate article content (this is always needed on a cache miss)
    const articleResult = await generateArticle({ topic: staticTopic.title }).catch(e => {
        console.error(`Failed to generate content for topic: ${staticTopic.title}`, e.message);
        return {
            summary: "Error: Could not generate content.",
            content: `<h2>Article Generation Failed</h2><p>An unexpected error occurred while trying to generate the article.</p><p><strong>Topic attempted:</strong> ${staticTopic.title}</p><p><strong>Error Details:</strong> ${e.message}</p>`,
        };
    });

    const fullArticle: FullArticle = {
        ...staticTopic,
        slug: slug,
        summary: articleResult.summary,
        content: articleResult.content,
        imageUrl: finalImageUrl, // Use the determined image URL
    };

    // 4. Write to cache ONLY IF image generation was successful
    if (fullArticle.imageUrl && !fullArticle.content.includes("Article Generation Failed")) {
        try {
            await fs.writeFile(cacheFilePath, JSON.stringify(fullArticle, null, 2));
            console.log(`[Cache] Wrote new cache file for "${slug}".`);
        } catch (error) {
            console.error(`[Cache] Error writing cache file for ${slug}:`, error);
        }
    } else {
        console.warn(`[Cache] SKIPPING cache write for "${slug}" because image or content generation failed.`);
    }
    
    return fullArticle;
}

    