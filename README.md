
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a powerful AI system to generate a complete library of in-depth automotive articles live, on-demand. This provides users with the freshest content possible, directly from the AI.

## Getting Started

This project requires **one environment variable** for all features to work correctly.

### Required Environment Variable

For the website to generate its content, you **must** create a `.env` file in the project's root directory and add your OpenRouter API key.

The file content should look like this:
```
OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

1.  **`OPENROUTER_API_KEY`**: Your API key for the OpenRouter service, which is used to generate article content with the LLaMA 3 model. You can get a free key from the [OpenRouter website](https://openrouter.ai/).

> **IMPORTANT:** Without this key in a `.env` file (for local development) or set as an environment variable in your hosting provider (for production), the article generation will fail and users will see an error message on the article pages.

## Content Strategy: Live AI Generation

This application uses a dynamic content strategy to ensure every article is as fresh as possible.

-   **Live AI Generation:** When a user visits an article page, the content is generated in real-time by the powerful `meta-llama/llama-3-70b-instruct` model via OpenRouter. This ensures the information is always up-to-date.
-   **No Database Needed:** This simplified approach removes the need for any external database setup, making the project easier to manage and deploy.
-   **Static Topic Base:** The site is built on a stable foundation of 60 curated article topics. This ensures that all category pages and article URLs are permanent and SEO-friendly.
-   **Daily Homepage Refresh:** To keep the experience fresh, the homepage automatically shuffles the article topics every 24 hours to feature a new set of 6 "trending" articles.
