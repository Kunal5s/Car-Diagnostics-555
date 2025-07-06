
// This line MUST be at the very top to ensure environment variables are loaded.
// It looks for the .env file in the parent directory (the project root).
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const fetch = require('node-fetch');
const sharp = require('sharp');
const { Octokit } = require('@octokit/rest');

// --- Configuration ---
// IMPORTANT: Your GitHub token must be set as an environment variable (GITHUB_TOKEN).
// For local testing, you can create a .env file in the root directory.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'kunal5s';
const GITHUB_REPO = 'ai-blog-images';
const BRANCH = 'main';
const IMAGE_MODEL = 'flux-realism'; // As requested: 'flux-realism'

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// This list is duplicated from the main app to make this script fully self-contained.
// This ensures it can run independently without complex pathing to import from /src.
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


function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Pushes a file to the GitHub repository.
 * @param {string} filePath - The path to the file in the repo (e.g., 'public/images/slug.jpg').
 * @param {Buffer} contentBuffer - The file content as a Buffer.
 * @param {string} commitMessage - The commit message.
 */
async function pushToGitHub(filePath, contentBuffer, commitMessage) {
  let sha;
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      ref: BRANCH,
    });
    sha = data.sha;
    console.log(`  - File already exists at ${filePath}. It will be overwritten.`);
  } catch (error) {
    if (error.status === 404) {
      console.log(`  - File does not exist at ${filePath}. Creating new file.`);
      sha = undefined;
    } else {
      console.error(`  ❌ Error checking file content for ${filePath}:`, error.message);
      throw error;
    }
  }

  try {
      await octokit.repos.createOrUpdateFileContents({
        owner: GITHUB_OWNER,
        repo: GZIP_REPO,
        path: filePath,
        message: commitMessage,
        content: contentBuffer.toString('base64'),
        branch: BRANCH,
        sha,
      });
      console.log(`  ✅ Successfully pushed ${filePath} to GitHub.`);
  } catch (error) {
    console.error(`  ❌ Failed to push ${filePath} to GitHub:`, error.message);
    throw error;
  }
}

/**
 * Processes a single article topic: generates, compresses, and uploads an image.
 * @param {{id: number, title: string, category: string}} topic - The article topic object.
 */
async function processArticle(topic) {
  const slug = `${slugify(topic.title)}-${topic.id}`;
  const imagePath = `public/images/${slug}.jpg`;
  
  // A more robust prompt using both title and category.
  const prompt = `${topic.title}, ${topic.category}, automotive, technical illustration, photorealistic`;

  console.log(`\nProcessing Article #${topic.id}: "${topic.title}"`);
  console.log(`  - Prompt: "${prompt}"`);

  // 1. Generate Image from Pollinations AI
  let imageBuffer;
  try {
    console.log(`  - Fetching image from Pollinations AI using model: ${IMAGE_MODEL}...`);
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${IMAGE_MODEL}&width=512&height=512&nologo=true&seed=${seed}`;
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
    }
    imageBuffer = await response.buffer();
  } catch (err) {
    console.error(`  ❌ Error generating image for "${topic.title}":`, err.message);
    return; // Skip this article on error
  }

  // 2. Compress Image with Sharp
  let compressedBuffer;
  try {
    console.log('  - Compressing image...');
    compressedBuffer = await sharp(imageBuffer)
      .resize(512, 512)
      .jpeg({ quality: 30 }) // Compress to ~30KB
      .toBuffer();
  } catch (err) {
    console.error(`  ❌ Error compressing image for "${topic.title}":`, err);
    return;
  }

  // 3. Push to GitHub
  try {
    const commitMessage = `feat: add image for article ${topic.id}`;
    await pushToGitHub(imagePath, compressedBuffer, commitMessage);
  } catch (err) {
     console.error(`  ❌ GitHub push failed for "${topic.title}".`);
  }
}

/**
 * Main function to run the script.
 */
async function main() {
  if (!GITHUB_TOKEN) {
    console.error("========================================================================");
    console.error("❌ ERROR: GitHub token not found.");
    console.error("   Please set the GITHUB_TOKEN environment variable in your project's");
    console.error("   root .env file. The script will not work without it.");
    console.error("========================================================================");
    return;
  }
  console.log(`🚀 Starting image generation for ${allArticleTopics.length} articles.`);
  console.log(`   Using GitHub repository: ${GITHUB_OWNER}/${GITHUB_REPO}`);
  
  for (const topic of allArticleTopics) {
    await processArticle(topic);
    // Add a delay to be respectful to the Pollinations API and avoid rate-limiting
    await new Promise(resolve => setTimeout(resolve, 2000)); 
  }

  console.log("\n✅ All articles processed successfully!");
}

main().catch(err => {
  console.error("\nAn unexpected error occurred during the script execution:", err);
});
