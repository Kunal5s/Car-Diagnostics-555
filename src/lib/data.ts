
import { generateArticle, type GenerateArticleOutput } from '@/ai/flows/generate-article';
import type { FullArticle, ArticleTopic } from './definitions';
import { slugify } from './utils';

// The single source of truth for all article topics.
const allArticleTopics: Omit<ArticleTopic, 'slug' | 'id'>[] = [
    { title: "Advanced Methods for Diagnosing Common Engine Performance Issues Today", category: "Engine" },
    { title: "A Step-by-Step Guide for Safely Resolving Engine Overheating", category: "Engine" },
    { title: "Understanding When to Replace Your Car's Critical Timing Belt", category: "Engine" },
    { title: "The Top Five Reasons Your Car's Check Engine Light is On", category: "Engine" },
    { title: "Modern Diagnostic Techniques for Advanced Turbocharger System Problems", category: "Engine" },
    { title: "Troubleshooting and Fixing Low Oil Pressure Problems in Your Vehicle", category: "Engine" },
    { title: "A Complete Guide to Testing and Replacing Faulty Automotive Sensors", category: "Sensors" },
    { title: "The Essential Role and Function of Oxygen Sensors in Modern Vehicles", category: "Sensors" },
    { title: "How to Properly Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors" },
    { title: "The Relationship Between Crankshaft and Camshaft Position Sensors", category: "Sensors" },
    { title: "A Guide to Diagnosing and Fixing Issues With Your Car's TPMS", category: "Sensors" },
    { title: "The Critical Importance of a Functioning Coolant Temperature Sensor", category: "Sensors" },
    { title: "The Top 10 Most Common OBD2 Diagnostic Codes and What They Mean", category: "OBD2" },
    { title: "A Beginner's Guide to Using OBD2 Scanners for Car Diagnostics", category: "OBD2" },
    { title: "A Guide to Using Advanced OBD2 Live Data and Freeze Frame Analysis", category: "OBD2" },
    { title: "The Proper Procedure for How to Clear OBD2 Codes After a Car Repair", category: "OBD2" },
    { title: "Using Modern Bluetooth OBD2 Scanners With Your Smartphone", category: "OBD2" },
    { title: "What is OBD3 and How Will It Change Car Diagnostics in the Future?", category: "OBD2" },
    { title: "What to Do When Your Car's Dashboard Warning Lights Come On", category: "Alerts" },
    { title: "A Deep Dive into Your Car's Most Important Dashboard Warning Alerts", category: "Alerts" },
    { title: "A Detailed Guide to Decoding Your Car's ABS and Traction Control Lights", category: "Alerts" },
    { title: "A Guide to Understanding Why Your Car's Battery and Alternator Lights Matter", category: "Alerts" },
    { title: "A Guide to Understanding the Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts" },
    { title: "A Driver's Guide on How to Respond to a Flashing Check Engine Light", category: "Alerts" },
    { title: "A Guide to the Top Car Diagnostic Mobile Apps for Android and iOS", category: "Apps" },
    { title: "A Guide to How Modern Car Diagnostic Apps Can Save You Money", category: "Apps" },
    { title: "A Guide to Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps" },
    { title: "A Comparison of the Best Features of Modern Car Diagnostic Apps", category: "Apps" },
    { title: "The Future of Car Diagnostics is in Your Pocket: Trends and Innovations", category: "Apps" },
    { title: "A Step-by-Step Guide on How to Connect Your Car to a Diagnostic App", category: "Apps" },
    { title: "A Guide to Essential DIY Car Maintenance Tips for Every Car Owner", category: "Maintenance" },
    { title: "A Complete Seasonal Car Maintenance Checklist for Modern Vehicles", category: "Maintenance" },
    { title: "A Guide to How to Check and Change Your Car's Essential Fluids", category: "Maintenance" },
    { title: "A Guide to the Importance of Regular Brake System Inspection Maintenance", category: "Maintenance" },
    { title: "A Guide to Rotating Your Car's Tires for Maximum Longevity", category: "Maintenance" },
    { title: "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance" },
    { title: "A Guide to Simple Ways to Maximize Your Car's Fuel Economy", category: "Fuel" },
    { title: "A Guide to Troubleshooting the Most Common Fuel System Problems in Cars", category: "Fuel" },
    { title: "An Essential Guide on How to Know if You Have a Clogged Fuel Filter", category: "Fuel" },
    { title: "A Guide to Understanding the Differences Between Gasoline Grades and Octane Ratings", category: "Fuel" },
    { title: "A Guide to Understanding the Role of the Fuel Pump in Your Vehicle", category: "Fuel" },
    { title: "A Guide to Diagnosing a Malfunctioning or Failing Modern Fuel Injector", category: "Fuel" },
    { title: "A Complete Guide to Electric Vehicle Battery Health Maintenance", category: "EVs" },
    { title: "Everything You Need to Know About EV Home Charging", category: "EVs" },
    { title: "How Regenerative Braking Works In Modern Electric Vehicles Today", category: "EVs" },
    { title: "Common and Important Maintenance Tasks For Your Electric Vehicle", category: "EVs" },
    { title: "Understanding Electric Vehicle Range and How to Maximize It", category: "EVs" },
    { title: "The Key Differences Between AC and DC Fast Charging", category: "EVs" },
    { title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends" },
    { title: "Exploring the Latest Innovations in Connected Car Technologies", category: "Trends" },
    { title: "How Over-the-Air Updates Are Changing Modern Car Ownership", category: "Trends" },
    { title: "The Inevitable Rise of Autonomous Driving and Its Safety", category: "Trends" },
    { title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving", category: "Trends" },
    { title: "Understanding the Role of Big Data In Modern Vehicles", category: "Trends" }
];

// In-memory cache for generated articles to avoid repeated API calls.
const articleCache = new Map<string, FullArticle>();

const topicsCache: ArticleTopic[] = allArticleTopics.map((topic, index) => ({
    ...topic,
    id: index + 1,
    slug: `${slugify(topic.title)}-${index + 1}`
}));

export async function getAllTopics(): Promise<ArticleTopic[]> {
  return topicsCache;
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  // The first 6 articles are considered "trending" for the homepage.
  return topicsCache.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  return topicsCache.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    // 1. Check cache first
    if (articleCache.has(slug)) {
        return articleCache.get(slug);
    }

    // 2. Find the topic from the slug
    const topic = topicsCache.find(t => t.slug === slug);
    if (!topic) {
        return undefined;
    }

    try {
        // 3. If not in cache, generate the article
        console.log(`Generating article for topic: "${topic.title}"`);
        const generatedContent: GenerateArticleOutput = await generateArticle({ topic: topic.title });

        const fullArticle: FullArticle = {
            id: topic.id,
            title: topic.title,
            category: topic.category,
            slug: topic.slug,
            summary: generatedContent.summary,
            content: generatedContent.content,
        };

        // 4. Store in cache for subsequent requests
        articleCache.set(slug, fullArticle);

        return fullArticle;
    } catch (error) {
        console.error(`Failed to generate article for slug "${slug}":`, error);
        // Return a partial article object so the page can render an error message
        // without crashing.
        return {
            id: topic.id,
            title: topic.title,
            category: topic.category,
            slug: topic.slug,
            summary: 'Failed to generate article summary.',
            content: '', // Sending empty content to be handled by the page component
        };
    }
}

// This function is used by the sitemap. It returns all possible article topics.
export async function getAllArticles(): Promise<ArticleTopic[]> {
    return topicsCache;
}
