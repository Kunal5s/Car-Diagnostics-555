
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// ✅ Prompt (you can change this)
const prompt = "Advanced Car Engine Sensor Diagnostic System";
const model = "flux-realism"; // You can use other models too
const width = 512;
const height = 512;

// ✅ Generate image URL
const encodedPrompt = encodeURIComponent(prompt);
const seed = Math.floor(Math.random() * 1000000);
const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${model}&width=${width}&height=${height}&nologo=true&seed=${seed}`;

const outputDir = "./output";
const fileName = `${Date.now()}-${model}.jpg`;
const filePath = path.join(outputDir, fileName);

// ✅ Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateImage() {
  try {
    console.log("🌐 Fetching image from Pollinations...");
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // ✅ Compress image with sharp
    await sharp(buffer)
      .resize(width)
      .jpeg({ quality: 30 }) // Around 30 KB
      .toFile(filePath);

    console.log(`✅ Image saved to: ${filePath}`);
  } catch (err) {
    console.error("❌ Error generating image:", err);
  }
}

generateImage();
