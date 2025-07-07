
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// 🔑 Set these in your Firebase environment:
// firebase functions:config:set keys.together="YOUR_TOGETHER_API_KEY"
// firebase functions:config:set keys.github="YOUR_GITHUB_TOKEN"
const TOGETHER_API_KEY = functions.config().keys.together;
const GITHUB_TOKEN = functions.config().keys.github;

const GITHUB_REPO = "your_username/your_repo"; // e.g., kunal21/ai-blog
const GITHUB_BRANCH = "main";

const categories = [
  "technology", "health", "sports", "food",
  "finance", "travel", "education", "science", "lifestyle",
];

exports.generateAndPushArticles = functions.pubsub
  .schedule("every day 06:00")
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🚀 Starting daily article generation...");

    if (!TOGETHER_API_KEY || !GITHUB_TOKEN) {
      console.error("❌ Missing API keys. Set them using `firebase functions:config:set`");
      return null;
    }
    if (GITHUB_REPO === "your_username/your_repo") {
      console.error("❌ GitHub repository is not configured. Please update GITHUB_REPO variable in the code.");
      return null;
    }

    for (const category of categories) {
      for (let i = 0; i < 4; i++) {
        const topic = `Write a 1500-word blog post in the category "${category}" with SEO, friendly tone, and H2 subheadings. The article should be engaging, informative, and well-structured.`;
        let content = "Error: Could not generate article content.";

        try {
          console.log(`Generating article for category: ${category} (${i + 1}/4)`);
          const aiResponse = await axios.post(
            "https://api.together.xyz/v1/chat/completions",
            {
              model: "mistralai/Mixtral-8x7B-Instruct",
              messages: [{role: "user", content: topic}],
              temperature: 0.7,
              max_tokens: 2048,
            },
            {
              headers: {
                "Authorization": `Bearer ${TOGETHER_API_KEY}`,
                "Content-Type": "application/json",
              },
            },
          );

          if (aiResponse.data.choices && aiResponse.data.choices[0]) {
            content = aiResponse.data.choices[0].message.content;
          } else {
            console.error(`❌ Unexpected response from Together AI for category ${category}.`);
          }
        } catch (aiError: any) {
          console.error(`❌ Error calling Together AI for category ${category}:`, aiError.response?.data || aiError.message);
          continue;
        }

        const date = new Date().toISOString().split("T")[0];
        const filename = `${date}-${category}-${i + 1}.md`;
        const path = `articles/${category}/${filename}`;
        const encodedContent = Buffer.from(content).toString("base64");

        try {
          await axios.put(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
            {
              message: `feat(content): Add article: ${filename}`,
              content: encodedContent,
              branch: GITHUB_BRANCH,
            },
            {
              headers: {
                "Authorization": `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
              },
            },
          );
          console.log(`✅ Article pushed to GitHub: ${path}`);
        } catch (githubError: any) {
          console.error(`❌ Error saving article to GitHub (${path}):`, githubError.response?.data || githubError.message);
        }
      }
    }

    console.log("🎉 Daily article generation job completed.");
    return null;
  });
