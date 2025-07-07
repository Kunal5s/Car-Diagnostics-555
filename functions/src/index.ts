
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// 🔑 Set these in your Firebase environment:
// firebase functions:config:set keys.together="YOUR_TOGETHER_AI_KEY"
// firebase functions:config:set keys.github="YOUR_GITHUB_TOKEN"
// firebase functions:config:set github.repo="your_username/your_repo"
const TOGETHER_API_KEY = functions.config().keys.together;
const GITHUB_TOKEN = functions.config().keys.github;
const GITHUB_REPO = functions.config().github.repo;
const GITHUB_BRANCH = "main";

const categories = [
  "Engine", "Sensors", "OBD2", "Alerts", "Apps",
  "Maintenance", "Fuel", "EVs", "Trends",
];

const slugify = (text: string) => text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

exports.generateAndPushArticles = functions.runWith({ timeoutSeconds: 540, memory: '1GB' }).pubsub
  .schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🚀 Starting daily article generation job...");

    if (!GITHUB_TOKEN || !GITHUB_REPO || GITHUB_REPO === 'your_username/your_repo' || !TOGETHER_API_KEY) {
      console.error("❌ Missing or default API Key/Repo configuration. Set keys.together, keys.github, and github.repo in Firebase environment.");
      return null;
    }

    const usedTopics = new Set();

    for (const category of categories) {
      for (let i = 0; i < 4; i++) {
        try {
          console.log(`🧠 Generating topic for category: ${category} (${i + 1}/4)`);
          
          const topicPrompt = `Suggest a unique and engaging blog post title for the automotive category: "${category}". The title should not be on this list: [${Array.from(usedTopics).join(", ")}]. Respond with only the title text, nothing else.`;
          
          const topicResponse = await axios.post("https://api.together.xyz/v1/chat/completions",
              { model: "mistralai/Mixtral-8x7B-Instruct", messages: [{ role: "user", content: topicPrompt }], temperature: 0.8, max_tokens: 60 },
              { headers: { Authorization: `Bearer ${TOGETHER_API_KEY}` } }
          );
          const articleTopic = topicResponse.data.choices[0].message.content.trim().replace(/"/g, '');
          usedTopics.add(articleTopic);
          
          console.log(`📝 Generating article for topic: "${articleTopic}"`);

          const generationPrompt = `You are an expert automotive writer. Your task is to write a detailed, SEO-friendly article of at least 1500 words on the topic: "${articleTopic}".
          The article must be well-structured with a main H1 title, multiple H2 sections, and H3 sub-sections.
          Your response MUST be a single, valid JSON object with two keys:
          1. "summary": A concise, SEO-friendly summary of the article (around 160 characters).
          2. "content": The full article in Markdown format. The H1 title must be the very first line of the content.`;

          const aiResponse = await axios.post("https://api.together.xyz/v1/chat/completions",
              { model: "mistralai/Mixtral-8x7B-Instruct", messages: [{ role: "user", content: generationPrompt }], temperature: 0.7, max_tokens: 4096, response_format: { type: "json_object" }},
              { headers: { Authorization: `Bearer ${TOGETHER_API_KEY}` } }
          );
          
          const responseContent = aiResponse.data.choices[0].message.content;
          const articleJson = JSON.parse(responseContent);

          const articleId = Math.floor(1000 + Math.random() * 9000);
          const slug = `${slugify(articleTopic)}-${articleId}`;

          const fullArticle = {
              id: articleId,
              title: articleTopic,
              category: category,
              slug: slug,
              summary: articleJson.summary,
              content: articleJson.content,
              imageUrl: null,
              status: "ready"
          };
          
          const path = `.cache/articles/${slug}.json`;
          const encodedContent = Buffer.from(JSON.stringify(fullArticle, null, 2)).toString("base64");

          await axios.put(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
              { message: `feat(content): Add article on ${articleTopic}`, content: encodedContent, branch: GITHUB_BRANCH, },
              { headers: { "Authorization": `token ${GITHUB_TOKEN}`, "Accept": "application/vnd.github.v3+json" } }
          );
          console.log(`✅ Article pushed to GitHub: ${path}`);

        } catch (error: any) {
          console.error(`❌ Error processing for category "${category}":`, error.response?.data || error.message);
        }
      }
    }
    console.log("🎉 Daily article generation job completed.");
    return null;
  });
