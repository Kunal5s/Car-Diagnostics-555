
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a powerful AI system to generate a complete library of in-depth automotive articles live, on-demand. This provides users with the freshest content possible, directly from the AI.

## Getting Started

This project requires **two environment variables** for all features to work correctly.

### Required Environment Variables

For the website to generate its content and images, you **must** create a `.env` file in the project's root directory and add your keys.

The file content should look like this:
```
OPENROUTER_API_KEY="your_openrouter_api_key_here"
GITHUB_TOKEN="your_github_personal_access_token"
```

1.  **`OPENROUTER_API_KEY`**: Your API key for the OpenRouter service, which is used to generate article content. You can get a free key from the [OpenRouter website](https://openrouter.ai/).
2.  **`GITHUB_TOKEN`**: A GitHub Personal Access Token with `repo` scope. This is required to automatically upload the generated article images to the public GitHub image repository.

> **IMPORTANT:** Without these keys, the article and image generation will fail, and users will see an error message on the article pages.

## Content Strategy: Live AI Generation & Integrated Image Upload

This application uses a dynamic content strategy to ensure every article is as fresh as possible.

-   **Live AI Generation:** When a user visits an article page for the first time, the content and a relevant feature image are generated in real-time by AI models.
-   **Integrated Image Upload:** The generated image is automatically compressed and uploaded to a dedicated public GitHub repository, ensuring it's permanently available.
-   **File-Based Caching:** Once an article and its image are generated, the complete data (including the image URL) is cached in a local file on the server. Subsequent visits load instantly from this cache.
-   **No Database Needed:** This simplified approach removes the need for any external database setup.
-   **Static Topic Base:** The site is built on a stable foundation of curated article topics, ensuring all URLs are permanent and SEO-friendly.
-   **Daily Homepage Refresh:** The homepage automatically shuffles topics every 24 hours to feature a new set of 6 "trending" articles.

    