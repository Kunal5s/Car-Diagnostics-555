
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// 🔑 Set these in your Firebase environment:
// firebase functions:config:set keys.together="YOUR_TOGETHER_AI_KEY"
// firebase functions:config:set keys.github="YOUR_GITHUB_TOKEN"
// firebase functions:config:set github.repo="your_username/your_repo"
// firebase functions:config:set github.images_repo="your_username/your_images_repo" // e.g., kunal5s/ai-blog-images
const TOGETHER_API_KEY = functions.config().keys.together;
const GITHUB_TOKEN = functions.config().keys.github;
const GITHUB_REPO = functions.config().github.repo;
const GITHUB_IMAGES_REPO = functions.config().github.images_repo || GITHUB_REPO; // Fallback to main repo
const GITHUB_BRANCH = "main";

const categories = [
  "Engine", "Sensors", "OBD2", "Alerts", "Apps",
  "Maintenance", "Fuel", "EVs", "Trends",
];

const slugify = (text: string) => text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

async function pushToGitHub(path: string, content: string, repo: string, message: string) {
    const encodedContent = Buffer.from(content).toString("base64");
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const data = {
        message: message,
        content: encodedContent,
        branch: GITHUB_BRANCH,
    };
    const headers = {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
    };
    await axios.put(url, data, { headers });
}

exports.generateAndPushArticles = functions.runWith({ timeoutSeconds: 540, memory: '1GB' }).pubsub
  .schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("🚀 Starting daily article generation job...");

    if (!GITHUB_TOKEN || !GITHUB_REPO || !TOGETHER_API_KEY) {
      console.error("❌ Missing or default API Key/Repo configuration. Set keys.together, keys.github, and github.repo in Firebase environment.");
      return null;
    }
     if (GITHUB_REPO === 'your_username/your_repo') {
        console.error("❌ Default GITHUB_REPO detected. Please configure github.repo in your Firebase environment.");
        return null;
    }

    const usedTopics = new Set();

    for (const category of categories) {
      for (let i = 0; i < 4; i++) {
        try {
          console.log(`🧠 Generating topic for category: ${category} (${i + 1}/4)`);
          
          const topicPrompt = `Suggest a unique and engaging blog post title for the automotive category: "${category}". The title should be about a specific problem, solution, or trend. The title should not be on this list: [${Array.from(usedTopics).join(", ")}]. Respond with only the title text, nothing else.`;
          
          const topicResponse = await axios.post("https://api.together.xyz/v1/chat/completions",
              { model: "mistralai/Mixtral-8x7B-Instruct", messages: [{ role: "user", content: topicPrompt }], temperature: 0.8, max_tokens: 60 },
              { headers: { Authorization: `Bearer ${TOGETHER_API_KEY}` } }
          );
          const articleTopic = topicResponse.data.choices[0].message.content.trim().replace(/"/g, '');
          
          if (usedTopics.has(articleTopic)) {
            console.log(`⏩ Skipping duplicate topic: "${articleTopic}"`);
            continue;
          }
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

          const articleId = Date.now() + i;
          const slug = `${slugify(articleTopic)}-${articleId}`;

          console.log(`🖼️ Generating image for: "${articleTopic}"`);
          const imagePrompt = encodeURIComponent(articleTopic.trim());
          const imageUrlPollinations = `https://image.pollinations.ai/prompt/${imagePrompt}?model=flux-realism&width=896&height=504&nologo=true`;
          
          const imageResponse = await axios.get(imageUrlPollinations, { responseType: 'arraybuffer' });
          const imageContent = Buffer.from(imageResponse.data, 'binary').toString('base64');
          
          const imagePath = `public/images/${slug}.jpg`;
          console.log(`⬆️ Uploading image to GitHub: ${imagePath} in repo ${GITHUB_IMAGES_REPO}`);
          await pushToGitHub(imagePath, imageContent, GITHUB_IMAGES_REPO, `feat(images): Add image for ${slug}`);
          const publicImageUrl = `https://raw.githubusercontent.com/${GITHUB_IMAGES_REPO}/${GITHUB_BRANCH}/${imagePath}`;

          const fullArticle = {
              id: articleId,
              title: articleTopic,
              category: category,
              slug: slug,
              summary: articleJson.summary,
              content: articleJson.content,
              imageUrl: publicImageUrl,
              status: "ready"
          };
          
          const articlePath = `.cache/articles/${slug}.json`;
          await pushToGitHub(articlePath, JSON.stringify(fullArticle, null, 2), GITHUB_REPO, `feat(content): Add article on ${articleTopic}`);
          console.log(`✅ Article pushed to GitHub: ${articlePath}`);

        } catch (error: any) {
          console.error(`❌ Error processing for category "${category}":`, error.response?.data || error.message);
        }
      }
    }
    console.log("🎉 Daily article generation job completed.");
    return null;
  });
