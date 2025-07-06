'use server';

import type { FullArticle } from './definitions';
import { slugify } from "./utils";
import { generateArticle } from "@/ai/flows/generate-article";
import { getImageForQuery } from './pexels';
import { promises as fs } from 'fs';
import path from 'path';

// This is the static list of all 60 topics.
const allArticleTopics: Omit<FullArticle, 'slug' | 'imageUrl' | 'summary' | 'content'>[] = [
  { id: 1, title: "Advanced Methods for Diagnosing Common Engine Performance Issues Today", category: "Engine" },
  { id: 2, title: "A Step-by-Step Guide for Safely Resolving Engine Overheating", category: "Engine" },
  { id: 3, title: "Understanding When to Replace Your Car's Critical Timing Belt", category: "Engine" },
  { id: 4, title: "The Top Five Reasons Your Car's Check Engine Light is On", category: "Engine" },
  { id: 5, title: "Modern Diagnostic Techniques for Advanced Turbocharger System Problems", category: "Engine" },
  { id: 6, title: "Troubleshooting and Fixing Low Oil Pressure Problems in Your Vehicle", category: "Engine" },
  { id: 7, title: "A Complete Guide to Testing and Replacing Faulty Automotive Sensors", category: "Sensors" },
  { id: 8, title: "The Essential Role and Function of Oxygen Sensors in Modern Vehicles", category: "Sensors" },
  { id: 9, title: "How to Properly Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors" },
  { id: 10, title: "The Relationship Between Crankshaft and Camshaft Position Sensors", category: "Sensors" },
  { id: 11, title: "A Guide to Diagnosing and Fixing Issues With Your Car's TPMS", category: "Sensors" },
  { id: 12, title: "The Critical Importance of a Functioning Coolant Temperature Sensor", category: "Sensors" },
  { id: 13, title: "The Top 10 Most Common OBD2 Diagnostic Codes and What They Mean", category: "OBD2" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners for Car Diagnostics", category: "OBD2" },
  { id: 15, title: "A Guide to Using Advanced OBD2 Live Data and Freeze Frame Analysis", category: "OBD2" },
  { id: 16, title: "The Proper Procedure for How to Clear OBD2 Codes After a Car Repair", category: "OBD2" },
  { id: 17, title: "Using Modern Bluetooth OBD2 Scanners With Your Smartphone", category: "OBD2" },
  { id: 18, title: "What is OBD3 and How Will It Change Car Diagnostics in the Future?", category: "OBD2" },
  { id: 19, title: "What to Do When Your Car's Dashboard Warning Lights Come On", category: "Alerts" },
  { id: 20, title: "A Deep Dive into Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
  { id: 21, title: "A Detailed Guide to Decoding Your Car's ABS and Traction Control Lights", category: "Alerts" },
  { id: 22, title: "A Guide to Understanding Why Your Car's Battery and Alternator Lights Matter", category: "Alerts" },
  { id: 23, title: "A Guide to Understanding the Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
  { id: 24, title: "A Driver's Guide on How to Respond to a Flashing Check Engine Light", category: "Alerts" },
  { id: 25, title: "A Guide to the Top Car Diagnostic Mobile Apps for Android and iOS", category: "Apps" },
  { id: 26, title: "A Guide to How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
  { id: 27, title: "A Guide to Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
  { id: 28, title: "A Comparison of the Best Features of Modern Car Diagnostic Apps", category: "Apps" },
  { id: 29, title: "The Future of Car Diagnostics is in Your Pocket: Trends and Innovations", category: "Apps" },
  { id: 30, title: "A Step-by-Step Guide on How to Connect Your Car to a Diagnostic App", category: "Apps" },
  { id: 31, title: "A Guide to Essential DIY Car Maintenance Tips for Every Car Owner", category: "Maintenance" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist for Modern Vehicles", category: "Maintenance" },
  { id: 33, title: "A Guide to How to Check and Change Your Car's Essential Fluids", category: "Maintenance" },
  { id: 34, title: "A Guide to the Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
  { id: 35, title: "A Guide to Rotating Your Car's Tires for Maximum Longevity", category: "Maintenance" },
  { id: 36, title: "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
  { id: 37, title: "A Guide to Simple Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
  { id: 38, title: "A Guide to Troubleshooting the Most Common Fuel System Problems in Cars", category: "Fuel" },
  { id: 39, title: "An Essential Guide on How to Know if You Have a Clogged Fuel Filter", category: "Fuel" },
  { id: 40, title: "A Guide to Understanding the Differences Between Gasoline Grades and Octane Ratings", category: "Fuel" },
  { id: 41, title: "A Guide to Understanding the Role of the Fuel Pump in Your Vehicle", category: "Fuel" },
  { id: 42, title: "A Guide to Diagnosing a Malfunctioning or Failing Modern Fuel Injector", category: "Fuel" },
  { id: 43, title: "A Complete Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
  { id: 45, title: "How Regenerative Braking Works In Modern Electric Vehicles Today", category: "EVs" },
  { id: 46, title: "Common and Important Maintenance Tasks For Your Electric Vehicle", category: "EVs" },
  { id: 47, title: "Understanding Electric Vehicle Range and How to Maximise It", category: "EVs" },
  { id: 48, title: "The Key Differences Between AC and DC Fast Charging", category: "EVs" },
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
  { id: 50, title: "Exploring the Latest Innovations in Connected Car Technologies", category: "Trends" },
  { id: 51, title: "How Over-the-Air Updates Are Changing Modern Car Ownership", category: "Trends" },
  { id: 52, title: "The Inevitable Rise of Autonomous Driving and Its Safety", category: "Trends" },
  { id: 53, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving", category: "Trends" },
  { id: 54, title: "Understanding the Role of Big Data In Modern Vehicles", category: "Trends" },
  { id: 55, title: "How to Perform a Basic Engine Compression Test and What the Results Mean", category: "Engine" },
  { id: 56, title: "Understanding Your Car's Suspension System: Shocks, Struts, and When to Replace Them", category: "Maintenance" },
  { id: 57, title: "Decoding Your Car's Throttle Position Sensor (TPS) and Its Impact on Performance", category: "Sensors" },
  { id: 58, title: "Fuel Additives: Do They Work and Which Ones Should You Use?", category: "Fuel" },
  { id: 59, title: "A Glossary of Common EV Terminology: From kWh to J1772", category: "EVs" },
  { id: 60, title: "The Role of 5G Technology in the Future of Connected and Autonomous Vehicles", category: "Trends" }
];

const articlesFilePath = path.join(process.cwd(), 'src', 'data', 'articles.json');
let cachedArticles: FullArticle[] | null = null;
let generationPromise: Promise<FullArticle[]> | null = null;

async function generateAndCacheArticles(): Promise<FullArticle[]> {
  console.log("Generating articles and images for the first time. This may take a while...");
  
  try {
    await fs.mkdir(path.dirname(articlesFilePath), { recursive: true });
  } catch (error) {
    console.error("Failed to create data directory:", error);
  }

  const articles: FullArticle[] = [];
  for (const topic of allArticleTopics) {
    console.log(`- Processing topic: "${topic.title}"`);
    
    let articleData = {
        summary: "Could not generate summary for this topic.",
        content: `# Article Generation Failed\n\nThere was an error generating the content for the topic "${topic.title}". This might be due to an API key issue or a network problem.`,
    };
    let imageUrl: string | null = null;

    try {
        const generatedData = await generateArticle({ topic: topic.title });
        if (generatedData) {
            articleData = generatedData;
        }
    } catch (e) {
        console.error(`  - Article generation failed for topic: ${topic.title}`, e);
    }

    try {
        imageUrl = await getImageForQuery(topic.title);
    } catch(e) {
        console.error(`  - Image fetch failed for topic: ${topic.title}`, e);
    }

    const slug = `${slugify(topic.title)}-${topic.id}`;
    articles.push({
        ...topic,
        slug: slug,
        summary: articleData.summary,
        content: articleData.content,
        imageUrl: imageUrl || `https://placehold.co/1200x600.png`
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  try {
    await fs.writeFile(articlesFilePath, JSON.stringify(articles, null, 2));
    console.log(`✅ Successfully generated and saved ${articles.length} articles to ${articlesFilePath}`);
  } catch (error) {
    console.error("❌ Failed to write articles cache file:", error);
  }
  
  return articles;
}


async function loadArticles(): Promise<FullArticle[]> {
  if (cachedArticles) {
    return cachedArticles;
  }
  
  try {
    const data = await fs.readFile(articlesFilePath, 'utf-8');
    const articles: FullArticle[] = JSON.parse(data);
    
    if (articles && articles.length > 0) {
      console.log(`Loaded ${articles.length} articles from file cache.`);
      cachedArticles = articles;
      return cachedArticles;
    }
  } catch (error) {
    console.log("Article cache file not found or is empty. Generating new articles...");
  }

  const newArticles = await generateAndCacheArticles();
  cachedArticles = newArticles;
  return newArticles;
}

export async function getArticles(): Promise<FullArticle[]> {
  if (cachedArticles) {
    return cachedArticles;
  }
  if (!generationPromise) {
    generationPromise = loadArticles();
  }
  return generationPromise;
}

export async function getAllTopics(): Promise<FullArticle[]> {
  return await getArticles();
}

export async function getHomepageTopics(): Promise<FullArticle[]> {
  const articles = await getArticles();
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

  const shuffledTopics = seededShuffle([...articles], seed);
  return shuffledTopics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<FullArticle[]> {
  const articles = await getArticles();
  const lowerCategoryName = categoryName.toLowerCase();
  return articles.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    const articles = await getArticles();
    return articles.find(p => p.slug === slug);
}
