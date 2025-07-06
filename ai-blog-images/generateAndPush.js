
import fetch from "node-fetch";
import sharp from "sharp";
import { Octokit } from "@octokit/rest";

// --- CONFIGURATION ---
// You must provide these values in your environment or here.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Recommended: Set in .env file
const GITHUB_OWNER = "kunal5s"; // The owner of the repository, e.g., your GitHub username
const GITHUB_REPO = "ai-blog-images"; // The name of the repository
const BRANCH = "main"; // The branch to commit to

// --- SCRIPT ---

// Check for GitHub Token
if (!GITHUB_TOKEN) {
  console.error(
    "Error: GITHUB_TOKEN is not set. Please set it in your environment variables."
  );
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Generates content for a given prompt and commits it to GitHub.
 * @param {string} prompt The prompt for generating the article and image.
 */
async function generateAndCommit(prompt) {
  console.log(`\nProcessing prompt: "${prompt}"...`);
  try {
    const today = new Date().toISOString().split("T")[0];
    const slug = prompt
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Define repository paths
    const imagePath = `public/images/${today}/${slug}.jpg`;
    const articlePath = `articles/${today}/${slug}.md`;

    // 1. Generate image from prompt using Pollinations AI
    console.log("  - Generating image...");
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux-realism&width=512&height=512&nologo=true&seed=${seed}`;
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }
    const imageBuffer = await imageResponse.buffer();

    // 2. Compress the image using Sharp
    console.log("  - Compressing image...");
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(512)
      .jpeg({ quality: 30 })
      .toBuffer();

    // 3. Create simple Markdown article content
    console.log("  - Creating markdown file...");
    const articleContent = `---
title: ${prompt}
date: ${today}
image: /images/${today}/${slug}.jpg
---

AI-generated article based on **"${prompt}"**

Stay tuned for more insights! 🚀
`;

    // 4. Push both the image and the article to the GitHub repository
    console.log(`  - Pushing files to GitHub...`);
    await pushToGitHub(
      imagePath,
      compressedImageBuffer.toString("base64"),
      `feat: add image for "${slug}"`,
      "base64"
    );
    await pushToGitHub(
      articlePath,
      articleContent,
      `feat: add article for "${slug}"`
    );

    console.log(`✅ Successfully uploaded image and article for "${prompt}"`);
  } catch (error) {
    console.error(`❌ Failed to process prompt "${prompt}":`, error.message);
  }
}

/**
 * Commits a file to the configured GitHub repository.
 * @param {string} filePath - The path of the file within the repository.
 * @param {string} content - The content of the file (can be base64 encoded).
 * @param {string} commitMessage - The message for the commit.
 * @param {string} [encoding="utf-8"] - Use 'base64' for binary files.
 */
async function pushToGitHub(
  filePath,
  content,
  commitMessage,
  encoding = "utf-8"
) {
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
    }
  } catch (error) {
    if (error.status !== 404) {
      throw error; // Rethrow actual errors
    }
    // If it's a 404, file doesn't exist, which is fine. sha remains undefined.
  }

  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: filePath,
    message: commitMessage,
    content:
      encoding === "base64"
        ? content
        : Buffer.from(content).toString("base64"),
    branch: BRANCH,
    sha,
  });
}

/**
 * Main execution function.
 */
async function main() {
  console.log("--- Starting Content Generation Script ---");
  // 🧪 Run Example
  await generateAndCommit("How AI Will Change Agriculture in 2030");
  console.log("--- Content Generation Script Finished ---");
}

main().catch(console.error);
