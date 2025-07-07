
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a sophisticated file-based caching system to display a complete library of in-depth, pre-generated automotive articles.

## Content Strategy: Stable, Fast, and Reliable

This application is designed for maximum performance and reliability by using a local, file-based content cache.

-   **Pre-Generated Content:** All articles and their associated metadata are stored in a single JSON file located at `/src/lib/articles.json`. This acts as the application's lightweight, built-in CMS.
-   **No Live Generation:** The application reads directly from the cached file and does **not** perform live AI generation or fetching during a user's visit. This guarantees a fast, error-free experience.
-   **No External Dependencies:** This simplified approach removes the need for external API keys, databases, or complex data-fetching logic during runtime. The app works perfectly "out of the box."

## Getting Started

This project is configured to run without any external API keys or environment variables.

To run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Future Expansion: Automated Content Updates

While the application currently uses a static content file, it can be expanded with an automated content pipeline. A separate, scheduled process (like a Vercel Cron Job or a GitHub Action) can be created to:

1.  Generate new articles and images using an AI model (e.g., Together AI).
2.  Commit the updated `articles.json` file back to the GitHub repository.
3.  Deploying this change will automatically update the content on the live website.

This architecture decouples the content generation from the web application, ensuring the user-facing site remains fast and stable at all times.
