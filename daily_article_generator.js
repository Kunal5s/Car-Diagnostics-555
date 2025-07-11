// daily_article_generator.js

// 🚀 Daily Article Generator with Time-Based Rotation

const path = require('path');
const axios = require("axios");
const fs = require("fs");

// 🎯 Priority models first, fallback models after token exhaustion
const PRIORITY_MODELS = [
  "qwen/qwen3-32b-chat",
  "qwen/qwen3-30b-a3b",
  "qwen/qwen3-8b",
  "shisaai/shisa-v2-llama3-70b",
  "tencent/hunyuan-a13b-chat"
];

const FALLBACK_MODELS = [
  "mistralai/mixtral-8x7b-instruct",
  "nousresearch/nous-hermes-2-mixtral",
  "cognitivecomputations/dolphin-2.9",
  "openchat/openchat-3.5",
  "huggingfaceh4/zephyr-7b-beta",
  "meta-llama/llama-3-8b-instruct",
  "openrouter/chronos-hermes-13b",
  "samantha/samantha-1.1",
  "gryphe/mythomax-l2-13b",
  "huggingfaceh4/zephyr-7b-alpha"
];

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // 🔐 Get API key from environment variables
const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK; // 🚀 Get Vercel Deploy Hook from environment variables

async function generateArticle(model, topic) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: `Write a 2000-word SEO-optimized article on: "${topic}". Use an engaging introduction, 4 sections with subheadings, and a compelling conclusion.`
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 0.9
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.warn(`⚠️ Model failed: ${model}`);
    return null; // Will trigger failover to next model
  }
}

async function generateArticlesAndImages(topicsToGenerate) {
  const generatedArticles = [];

  for (const topic of topicsToGenerate) {
    let article = null;
    const fullModelList = [...PRIORITY_MODELS, ...FALLBACK_MODELS];

    for (const model of fullModelList) {
      article = await generateArticle(model, topic);
      if (article) break; // ✅ If successful, move to next topic
    }
    if (article) {
      // Placeholder for Pollination image generation
      const imageUrl = await generateImageForTopic(topic); // Call the placeholder function

 generatedArticles.push({ topic, article, imageUrl });
      console.log(`✅ Generated article for: ${topic}`);
    } else {
      console.error(`❌ Failed to generate article for: ${topic}`);
    }
  }
  return generatedArticles;
}

// Placeholder function for Pollination image generation
async function generateImageForTopic(topic) {
  // TODO: Replace this with your actual Pollination API call logic
  console.log(`🖼️ Generating image for topic: "${topic}" using Pollination (Placeholder)`);
  // This is a placeholder. You need to replace this with code that calls your Pollination integration.
  // Example:
  // try {
  //   const response = await yourPollinationApiCallFunction(topic);
  //   return response.imageUrl; // Assuming your Pollination function returns an object with imageUrl
  // } catch (error) {
  //   console.error("❌ Pollination image generation failed:", error);
  //   return null; // Return null if image generation fails
  // }
  return `https://placeholder.com/images/svg/text/${encodeURIComponent(topic)}.svg`; // Placeholder image URL
}

async function saveArticle(articleData) {
  const slug = articleData.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const articleContent = {
    content: articleData.article,
    // Add other relevant metadata here
  };
  fs.writeFileSync(filename, JSON.stringify(articleContent, null, 2));
  console.log(`💾 Saved article to ${filename}`);
}

async function archiveOldArticles(categories) {
  const articlesDir = path.join(__dirname, '/_articles');
  const archiveDir = path.join(__dirname, '/_articles/archive');

  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
    console.log(`📁 Created archive directory: ${archiveDir}`);
  }

  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.json') && !file.includes('archive'));

  const articlesByCategory = {};
  files.forEach(file => {
    // Assuming category name is part of the filename or can be inferred
    // This is a simplification; you might need more robust category detection
    const category = categories.find(cat => file.toLowerCase().includes(cat.toLowerCase().replace(/\s+/g, '-')));
    if (category) {
      if (!articlesByCategory[category]) {
        articlesByCategory[category] = [];
      }
      const filePath = path.join(articlesDir, file);
      const stats = fs.statSync(filePath);
      articlesByCategory[category].push({ file, path: filePath, mtime: stats.mtime.getTime() });
    }
  });

  for (const category in articlesByCategory) {
    const sortedArticles = articlesByCategory[category].sort((a, b) => b.mtime - a.mtime); // Sort by newest first
    if (sortedArticles.length > 4) {
      const articlesToArchive = sortedArticles.slice(4);
      articlesToArchive.forEach(article => {
        const oldPath = article.path;
        const newPath = path.join(archiveDir, article.file);
        fs.renameSync(oldPath, newPath);
        console.log(`📦 Archived old article: ${article.file}`);
      });
    }
  }
}

async function triggerVercelDeploy() {
  if (!VERCEL_DEPLOY_HOOK) {
    console.warn("⚠️ Vercel Deploy Hook not configured. Skipping deployment trigger.");
    return;
  }
  try {
    await axios.post(VERCEL_DEPLOY_HOOK);
    console.log("🚀 Triggered Vercel deploy.");
  } catch (error) {
    console.error("❌ Failed to trigger Vercel deploy:", error.message);
  }
}

// 🚀 Main execution function
(async () => {
  const totalArticlesPerDay = 40; // Target 40 articles per day
  const categories = ["beginners-guide", "testing-replacing-sensors", "seasonal-maintenance", "ev-battery-maintenance", "turbocharger-diagnostics", "diagnostic-apps", "crankshaft-camshaft-sensors", "abs-traction-control", "engine-performance", "tire-pressure-sensors", "diy-maintenance", "ev-home-charging", "connected-car-tech", "obd2-live-data", "diagnostic-apps-money", "regenerative-braking", "check-change-fluids", "airflow-sensor", "clear-obd2-codes", "connect-diagnostic-app", "clogged-filter", "replace-timing-belt", "flashing-check-engine", "maximize-fuel-economy", "oxygen-sensors", "automotive-ai", "diagnostics-in-pocket", "coolant-temp-sensor", "brake-maintenance", "oil-pressure-light", "autonomous-driving", "common-obd2-codes", "mobile-diagnostic-apps", "check-engine-reasons", "low-oil-pressure", "fuel-system-problems", "dashboard-warnings", "bluetooth-obd2", "track-maintenance-apps", "dashboard-lights", "battery-alternator-lights", "engine-overheating"]; // Replace with your actual categories

  const now = new Date();
  const currentHour = now.getHours();

  let topicsToGenerate = [];

  // Determine topics based on time-based rotation strategy
  if (currentHour >= 0 && currentHour < 12) { // First 12 hours (Morning, Afternoon, Evening sessions)
    // For simplicity in this script, we'll generate a fixed number of articles
    // across categories during this 12-hour block.
    // In a more sophisticated implementation, you would distribute this across the 3 sub-sessions.
    const articlesPerCategory = Math.ceil((totalArticlesPerDay * 0.45) / categories.length); // Aim for approx 45% in the first 12 hours
    categories.forEach(category => {
      for (let i = 0; i < articlesPerCategory; i++) {
        topicsToGenerate.push(`${category} - Topic ${i + 1}`); // Example topic
      }
    });
  } else { // Second 12 hours (Night & Late Night)
    // Generate remaining articles spread across all categories
    const remainingArticles = totalArticlesPerDay - topicsToGenerate.length; // Calculate remaining needed (this might be 0 or negative if the first block generated more)
    const articlesPerCategory = Math.ceil(remainingArticles / categories.length);
    categories.forEach(category => {
      for (let i = 0; i < articlesPerCategory; i++) {
        topicsToGenerate.push(`${category} - Topic ${i + 1 + Math.random()}`); // Example topic with random suffix to ensure uniqueness
      }
    });

  }

  console.log(`🎯 Targeting ${topicsToGenerate.length} articles for this run.`);

  // Archive old articles before generating new ones
  await archiveOldArticles(categories);

  // Generate and save articles
  const generatedArticles = await generateArticlesForTopics(topicsToGenerate);
  for (const article of generatedArticles) {
    await saveArticle(article);
  }

  console.log(`\n📦 Total articles generated and saved in this run: ${generatedArticles.length}`);

  // Trigger Vercel deploy to publish new articles
  await triggerVercelDeploy();

})();