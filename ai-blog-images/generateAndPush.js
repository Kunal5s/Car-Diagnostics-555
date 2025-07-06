
import fetch from 'node-fetch';
import sharp from 'sharp';
import { Octokit } from '@octokit/rest';

// --- CONFIGURATION ---
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Recommended: Set in .env file in root
const GITHUB_OWNER = 'kunal5s';
const GITHUB_REPO = 'ai-blog-images';
const BRANCH = 'main';

// --- DATA ---
// Copied from src/lib/data.ts for script portability
const allArticleTopics = [
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

// --- HELPERS ---
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Commits a file to the configured GitHub repository.
 * @param {string} filePath - The path of the file within the repository.
 * @param {string} content - The content of the file (can be base64 encoded).
 * @param {string} commitMessage - The message for the commit.
 * @param {string} [encoding="utf-8"] - Use 'base64' for binary files.
 */
async function pushToGitHub(filePath, content, commitMessage, encoding = 'utf-8') {
  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: BRANCH,
    });
    if (data && data.sha) {
      sha = data.sha;
      console.log(`  - File ${filePath} exists. Updating it.`);
    }
  } catch (error) {
    if (error.status !== 404) {
      throw error; // Rethrow actual errors
    }
    // If it's a 404, file doesn't exist, which is fine. sha remains undefined.
    console.log(`  - File ${filePath} does not exist. Creating it.`);
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: filePath,
    message: commitMessage,
    content: encoding === 'base64' ? content : Buffer.from(content).toString('base64'),
    branch: BRANCH,
    sha,
  });
}

/**
 * Generates content for a given topic and commits it to GitHub.
 * @param {object} topic The article topic object.
 */
async function generateAndCommit(topic) {
  console.log(`\nProcessing topic: "${topic.title}"...`);
  try {
    const slug = `${slugify(topic.title)}-${topic.id}`;
    const prompt = `A professional, photorealistic image of a ${topic.category} system in a modern car, related to the topic: ${topic.title}. High detail, clean background.`;

    // Define repository paths (simplified without date for stable URLs)
    const imagePath = `public/images/${slug}.jpg`;
    const articlePath = `articles/${slug}.md`;

    // 1. Generate image from prompt using Pollinations AI
    console.log('  - Generating image...');
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000); // Random seed for variety
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux-schnell&width=512&height=512&nologo=true&seed=${seed}`;
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageBuffer = await imageResponse.buffer();

    // 2. Compress the image using Sharp to 512px and low quality
    console.log('  - Compressing image...');
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(512, 512)
      .jpeg({ quality: 30 }) // Low quality for small file size
      .toBuffer();

    console.log(`  - Compressed image size: ${(compressedImageBuffer.length / 1024).toFixed(2)} KB`);

    // 3. Create simple Markdown article content
    const articleContent = `---
title: "${topic.title}"
image: /images/${slug}.jpg
---

This is an AI-generated placeholder for the article on **"${topic.title}"**.
`;

    // 4. Push both the image and the article to the GitHub repository
    console.log(`  - Pushing files to GitHub...`);
    await pushToGitHub(
      imagePath,
      compressedImageBuffer.toString('base64'),
      `feat: add image for "${slug}"`,
      'base64'
    );
    await pushToGitHub(
      articlePath,
      articleContent,
      `feat: add article for "${slug}"`
    );

    console.log(`✅ Successfully processed and uploaded assets for "${topic.title}"`);
  } catch (error) {
    console.error(`❌ Failed to process topic "${topic.title}":`, error.message);
  }
}

/**
 * Main execution function.
 */
async function main() {
  if (!GITHUB_TOKEN) {
    console.error('Error: GITHUB_TOKEN is not set. Please create a .env file in the project root with your token.');
    process.exit(1);
  }
  console.log('--- Starting Image Generation and GitHub Push Script ---');

  for (const topic of allArticleTopics) {
    await generateAndCommit(topic);
    // Add a small delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n--- Script Finished ---');
}

main().catch(console.error);
