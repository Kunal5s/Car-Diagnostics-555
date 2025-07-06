
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a powerful AI system to generate a complete library of in-depth automotive articles and caches them to a local file for maximum performance and reliability.

## Getting Started

This project requires **two environment variables** to be set up for the AI features to work.

### 1. Required Environment Variables

For the website to generate its content, you **must** create a `.env` file in the project's root directory and add two API keys.

The file content should look like this:
```
OPENROUTER_API_KEY="your_openrouter_api_key_here"
PEXELS_API_KEY="your_pexels_api_key_here"
```

1.  **`OPENROUTER_API_KEY`**: Your API key for the OpenRouter service, which is used to generate article content. You can get a free key from the [OpenRouter website](https://openrouter.ai/).
2.  **`PEXELS_API_KEY`**: Your API key for the Pexels API, used to fetch article images. You can get a free key from the [Pexels API](https://www.pexels.com/api/) page.

> **IMPORTANT:** Without these keys in the `.env` file, the initial article and image generation will fail.

### 2. How to Deploy on Vercel or Firebase App Hosting

When you deploy your website to a hosting service like Vercel, you must set the `OPENROUTER_API_KEY` and `PEXELS_API_KEY` as environment variables in your project's settings on that platform. The local `.env` file is not used in production.

## Content Strategy: Generate-Once, Read-Many

This application uses a simple and robust content strategy to ensure maximum performance and reliability.

-   **First-Time Generation:** The very first time you run the application (either locally or on a hosting service), it will automatically generate all 60 articles using the `meta-llama/llama-3-70b-instruct` model via OpenRouter and fetch a relevant image for each from Pexels. This process can be slow and may take several minutes to complete.
-   **Static JSON Cache:** All the generated content and image URLs are saved into a single file: `src/data/articles.json`. This file will be created automatically.
-   **Blazing Fast Performance:** After the initial generation, the application will always read data directly from this local JSON file. This makes the website extremely fast and reliable, as it no longer depends on live API calls during runtime.
-   **How to Refresh Content:** If you ever want to regenerate all the articles with fresh content, you must trigger a new build/deployment on your hosting provider. For local development, you can simply delete the `src/data/articles.json` file and restart the development server.
