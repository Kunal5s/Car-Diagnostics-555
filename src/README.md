# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a powerful AI system to generate a complete library of in-depth automotive articles live, on-demand.

## Getting Started

This project requires **one environment variable** for all features to work correctly.

### 1. Required Environment Variable

For the website to generate its content, you **must** create a `.env` file in the project's root directory and add your OpenRouter API key.

The file content should look like this:
```
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

1.  **`OPENROUTER_API_KEY`**: Your API key for the OpenRouter service, which is used to generate article content with the `meta-llama/llama-3-70b-instruct` model. You can get a free key from the [OpenRouter website](https://openrouter.ai/).

> **IMPORTANT:** Without this key in a `.env` file (for local development) or set as an environment variable in your hosting provider (for production), the article generation will fail and users will see an error message on the article pages.

### 2. No Database Setup Needed

This project uses a simple and effective file-based caching system. There is no need to set up any external database like Supabase. The application will automatically create a `.cache` directory in the project to store generated articles, which makes the site fast and reliable.

## Content Strategy: Smart Caching for Speed

This application uses a hybrid content strategy to provide fresh content while ensuring maximum reliability and performance.

-   **On-Demand AI Generation:** When a user visits an article page for the very first time, the content is generated in real-time by a powerful AI model via OpenRouter.
-   **File-Based Smart Caching:** Once an article is generated, it's automatically saved (cached) in a local JSON file on the server for 24 hours. Any other user who visits that same article on the same day will be served the content instantly from this file cache, not from the AI.
-   **Reliability & Performance:** This "generate-once, serve-many" approach dramatically reduces API calls, lowers costs, and ensures the site is fast and reliable for most page loads, avoiding the errors and long waits common with live AI generation on every single request.
-   **Static Topic Base:** The site is built on a stable foundation of curated article topics. This ensures that all category pages and article URLs are permanent and SEO-friendly.
-   **Daily Homepage Refresh:** To keep the experience fresh, the homepage automatically shuffles the article topics every 24 hours to feature a new set of 6 "trending" articles.
