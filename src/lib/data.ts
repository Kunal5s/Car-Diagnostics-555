
'use server';

import type { FullArticle, ArticleTopic } from './definitions';
import { generateArticle } from '@/ai/flows/generate-article';

// Static source of truth for all article topics. This ensures stable URLs and navigation.
const allArticleTopics: ArticleTopic[] = [
  { id: 1, title: "Advanced Methods for Diagnosing Common Engine Performance Issues Today", category: "Engine", slug: "advanced-methods-for-diagnosing-common-engine-performance-issues-today-1" },
  { id: 2, title: "A Step-by-Step Guide for Safely Resolving Engine Overheating", category: "Engine", slug: "a-step-by-step-guide-for-safely-resolving-engine-overheating-2" },
  { id: 3, title: "Understanding When to Replace Your Car's Critical Timing Belt", category: "Engine", slug: "understanding-when-to-replace-your-cars-critical-timing-belt-3" },
  { id: 4, title: "The Top Five Reasons Your Car's Check Engine Light is On", category: "Engine", slug: "the-top-five-reasons-your-cars-check-engine-light-is-on-4" },
  { id: 5, title: "Modern Diagnostic Techniques for Advanced Turbocharger System Problems", category: "Engine", slug: "modern-diagnostic-techniques-for-advanced-turbocharger-system-problems-5" },
  { id: 6, title: "Troubleshooting and Fixing Low Oil Pressure Problems in Your Vehicle", category: "Engine", slug: "troubleshooting-and-fixing-low-oil-pressure-problems-in-your-vehicle-6" },
  { id: 7, title: "A Complete Guide to Testing and Replacing Faulty Automotive Sensors", category: "Sensors", slug: "a-complete-guide-to-testing-and-replacing-faulty-automotive-sensors-7" },
  { id: 8, title: "The Essential Role and Function of Oxygen Sensors in Modern Vehicles", category: "Sensors", slug: "the-essential-role-and-function-of-oxygen-sensors-in-modern-vehicles-8" },
  { id: 9, title: "How to Properly Clean Your Mass Airflow Sensor for Better Performance", category: "Sensors", slug: "how-to-properly-clean-your-mass-airflow-sensor-for-better-performance-9" },
  { id: 10, title: "The Relationship Between Crankshaft and Camshaft Position Sensors", category: "Sensors", slug: "the-relationship-between-crankshaft-and-camshaft-position-sensors-10" },
  { id: 11, title: "A Guide to Diagnosing and Fixing Issues With Your Car's TPMS", category: "Sensors", slug: "a-guide-to-diagnosing-and-fixing-issues-with-your-cars-tpms-11" },
  { id: 12, title: "The Critical Importance of a Functioning Coolant Temperature Sensor", category: "Sensors", slug: "the-critical-importance-of-a-functioning-coolant-temperature-sensor-12" },
  { id: 13, title: "The Top 10 Most Common OBD2 Diagnostic Codes and What They Mean", category: "OBD2", slug: "the-top-10-most-common-obd2-diagnostic-codes-and-what-they-mean-13" },
  { id: 14, title: "A Beginner's Guide to Using OBD2 Scanners for Car Diagnostics", category: "OBD2", slug: "a-beginners-guide-to-using-obd2-scanners-for-car-diagnostics-14" },
  { id: 15, title: "A Guide to Using Advanced OBD2 Live Data and Freeze Frame Analysis", category: "OBD2", slug: "a-guide-to-using-advanced-obd2-live-data-and-freeze-frame-analysis-15" },
  { id: 16, title: "The Proper Procedure for How to Clear OBD2 Codes After a Car Repair", category: "OBD2", slug: "the-proper-procedure-for-how-to-clear-obd2-codes-after-a-car-repair-16" },
  { id: 17, title: "Using Modern Bluetooth OBD2 Scanners With Your Smartphone", category: "OBD2", slug: "using-modern-bluetooth-obd2-scanners-with-your-smartphone-17" },
  { id: 18, title: "What is OBD3 and How Will It Change Car Diagnostics in the Future?", category: "OBD2", slug: "what-is-obd3-and-how-will-it-change-car-diagnostics-in-the-future-18" },
  { id: 19, title: "What to Do When Your Car's Dashboard Warning Lights Come On", category: "Alerts", slug: "what-to-do-when-your-cars-dashboard-warning-lights-come-on-19" },
  { id: 20, title: "A Deep Dive into Your Car's Most Important Dashboard Warning Alerts", category: "Alerts", slug: "a-deep-dive-into-your-cars-most-important-dashboard-warning-alerts-20" },
  { id: 21, title: "A Detailed Guide to Decoding Your Car's ABS and Traction Control Lights", category: "Alerts", slug: "a-detailed-guide-to-decoding-your-cars-abs-and-traction-control-lights-21" },
  { id: 22, title: "A Guide to Understanding Why Your Car's Battery and Alternator Lights Matter", category: "Alerts", slug: "a-guide-to-understanding-why-your-cars-battery-and-alternator-lights-matter-22" },
  { id: 23, title: "A Guide to Understanding the Meaning Behind Your Vehicle's Oil Pressure Light", category: "Alerts", slug: "a-guide-to-understanding-the-meaning-behind-your-vehicles-oil-pressure-light-23" },
  { id: 24, title: "A Driver's Guide on How to Respond to a Flashing Check Engine Light", category: "Alerts", slug: "a-drivers-guide-on-how-to-respond-to-a-flashing-check-engine-light-24" },
  { id: 25, title: "A Guide to the Top Car Diagnostic Mobile Apps for Android and iOS", category: "Apps", slug: "a-guide-to-the-top-car-diagnostic-mobile-apps-for-android-and-ios-25" },
  { id: 26, title: "A Guide to How Modern Car Diagnostic Apps Can Save You Money", category: "Apps", slug: "a-guide-to-how-modern-car-diagnostic-apps-can-save-you-money-26" },
  { id: 27, title: "A Guide to Using Car Apps to Track Maintenance and Vehicle Health", category: "Apps", slug: "a-guide-to-using-car-apps-to-track-maintenance-and-vehicle-health-27" },
  { id: 28, title: "A Comparison of the Best Features of Modern Car Diagnostic Apps", category: "Apps", slug: "a-comparison-of-the-best-features-of-modern-car-diagnostic-apps-28" },
  { id: 29, title: "The Future of Car Diagnostics is in Your Pocket: Trends and Innovations", category: "Apps", slug: "the-future-of-car-diagnostics-is-in-your-pocket-trends-and-innovations-29" },
  { id: 30, title: "A Step-by-Step Guide on How to Connect Your Car to a Diagnostic App", category: "Apps", slug: "a-step-by-step-guide-on-how-to-connect-your-car-to-a-diagnostic-app-30" },
  { id: 31, title: "A Guide to Essential DIY Car Maintenance Tips for Every Car Owner", category: "Maintenance", slug: "a-guide-to-essential-diy-car-maintenance-tips-for-every-car-owner-31" },
  { id: 32, title: "A Complete Seasonal Car Maintenance Checklist for Modern Vehicles", category: "Maintenance", slug: "a-complete-seasonal-car-maintenance-checklist-for-modern-vehicles-32" },
  { id: 33, title: "A Guide to How to Check and Change Your Car's Essential Fluids", category: "Maintenance", slug: "a-guide-to-how-to-check-and-change-your-cars-essential-fluids-33" },
  { id: 34, title: "A Guide to the Importance of Regular Brake System Inspection Maintenance", category: "Maintenance", slug: "a-guide-to-the-importance-of-regular-brake-system-inspection-maintenance-34" },
  { id: 35, title: "A Guide to Rotating Your Car's Tires for Maximum Longevity", category: "Maintenance", slug: "a-guide-to-rotating-your-cars-tires-for-maximum-longevity-35" },
  { id: 36, title: "A Guide to Knowing When and Why You Should Replace Your Car's Battery", category: "Maintenance", slug: "a-guide-to-knowing-when-and-why-you-should-replace-your-cars-battery-36" },
  { id: 37, title: "A Guide to Simple Ways to Maximize Your Car's Fuel Economy", category: "Fuel", slug: "a-guide-to-simple-ways-to-maximize-your-cars-fuel-economy-37" },
  { id: 38, title: "A Guide to Troubleshooting the Most Common Fuel System Problems in Cars", category: "Fuel", slug: "a-guide-to-troubleshooting-the-most-common-fuel-system-problems-in-cars-38" },
  { id: 39, title: "An Essential Guide on How to Know if You Have a Clogged Fuel Filter", category: "Fuel", slug: "an-essential-guide-on-how-to-know-if-you-have-a-clogged-fuel-filter-39" },
  { id: 40, title: "A Guide to Understanding the Differences Between Gasoline Grades and Octane Ratings", category: "Fuel", slug: "a-guide-to-understanding-the-differences-between-gasoline-grades-and-octane-ratings-40" },
  { id: 41, title: "A Guide to Understanding the Role of the Fuel Pump in Your Vehicle", category: "Fuel", slug: "a-guide-to-understanding-the-role-of-the-fuel-pump-in-your-vehicle-41" },
  { id: 42, title: "A Guide to Diagnosing a Malfunctioning or Failing Modern Fuel Injector", category: "Fuel", slug: "a-guide-to-diagnosing-a-malfunctioning-or-failing-modern-fuel-injector-42" },
  { id: 43, title: "A Complete Guide to Electric Vehicle Battery Health Maintenance", category: "EVs", slug: "a-complete-guide-to-electric-vehicle-battery-health-maintenance-43" },
  { id: 44, title: "Everything You Need to Know About EV Home Charging", category: "EVs", slug: "everything-you-need-to-know-about-ev-home-charging-44" },
  { id: 45, title: "How Regenerative Braking Works in Modern Electric Vehicles Today", category: "EVs", slug: "how-regenerative-braking-works-in-modern-electric-vehicles-today-45" },
  { id: 46, title: "Common and Important Maintenance Tasks For Your Electric Vehicle", category: "EVs", slug: "common-and-important-maintenance-tasks-for-your-electric-vehicle-46" },
  { id: 47, title: "Understanding Electric Vehicle Range and How to Maximize It", category: "EVs", slug: "understanding-electric-vehicle-range-and-how-to-maximize-it-47" },
  { id: 48, title: "The Key Differences Between AC and DC Fast Charging", category: "EVs", slug: "the-key-differences-between-ac-and-dc-fast-charging-48" },
  { id: 49, title: "The Future of Automotive Technology and AI Car Diagnostics", category: "Trends", slug: "the-future-of-automotive-technology-and-ai-car-diagnostics-49" },
  { id: 50, title: "Exploring the Latest Innovations in Connected Car Technologies", category: "Trends", slug: "exploring-the-latest-innovations-in-connected-car-technologies-50" },
  { id: 51, title: "How Over-the-Air Updates Are Changing Modern Car Ownership", category: "Trends", slug: "how-over-the-air-updates-are-changing-modern-car-ownership-51" },
  { id: 52, title: "The Inevitable Rise of Autonomous Driving and Its Safety", category: "Trends", slug: "the-inevitable-rise-of-autonomous-driving-and-its-safety-52" },
  { id: 53, title: "Vehicle-to-Everything (V2X) Communication and the Future of Driving", category: "Trends", slug: "vehicle-to-everything-v2x-communication-and-the-future-of-driving-53" },
  { id: 54, title: "Understanding the Role of Big Data in Modern Vehicles", category: "Trends", slug: "understanding-the-role-of-big-data-in-modern-vehicles-54" }
];

// In-memory cache to store generated articles for the lifetime of the server instance.
const articleCache = new Map<string, FullArticle>();

export async function getAllTopics(): Promise<ArticleTopic[]> {
  return allArticleTopics;
}

export async function getHomepageTopics(): Promise<ArticleTopic[]> {
  // Return the first 6 topics for the homepage grid.
  return allArticleTopics.slice(0, 6);
}

export async function getTopicsByCategory(categoryName: string): Promise<ArticleTopic[]> {
  const lowerCategoryName = categoryName.toLowerCase();
  return allArticleTopics.filter(topic => topic.category.toLowerCase() === lowerCategoryName);
}
  
export async function getArticleBySlug(slug: string): Promise<FullArticle | undefined> {
    // 1. Check the cache first for instant loads on subsequent visits.
    if (articleCache.has(slug)) {
        console.log(`Returning cached article for slug: "${slug}"`);
        return articleCache.get(slug);
    }

    // 2. If not in cache, find the topic details from our static list.
    const topicInfo = allArticleTopics.find(topic => topic.slug === slug);

    if (!topicInfo) {
        return undefined; // Topic not found, will result in a 404 page.
    }

    // 3. Generate the article using the AI flow.
    try {
        console.log(`Generating new article for slug: "${slug}"`);
        const generatedContent = await generateArticle({ topic: topicInfo.title });
        
        const fullArticle: FullArticle = {
            ...topicInfo,
            summary: generatedContent.summary,
            content: generatedContent.content,
        };

        // 4. Store the newly generated article in the cache.
        articleCache.set(slug, fullArticle);
        console.log(`Cached newly generated article for slug: "${slug}"`);
        
        return fullArticle;

    } catch (error) {
        console.error(`Failed to generate article for slug "${slug}":`, error);
        
        // 5. If generation fails, return a partial article with empty content.
        // The page component will handle this to show a user-friendly error message.
        return {
            ...topicInfo,
            summary: 'Error: Could not load summary.',
            content: '', // Set to empty to be handled gracefully by the page component.
        };
    }
}

// This function is used by the sitemap. It returns all possible article topics.
export async function getAllArticles(): Promise<ArticleTopic[]> {
    return allArticleTopics;
}
