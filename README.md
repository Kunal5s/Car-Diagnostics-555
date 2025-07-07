
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a powerful AI system to generate a complete library of in-depth automotive articles live, on-demand. This provides users with the freshest content possible, directly from the AI.

## Getting Started

This project is configured to run without any external API keys.

## Content Strategy: File-Based Cache

This application uses a file-based caching strategy for reliability and speed.

-   **Pre-Generated Content:** All article content and images are pre-generated and stored in local JSON files within the `.cache/articles` directory.
-   **No Live Generation:** The application reads directly from these cached files and does not perform live AI generation. This ensures maximum stability and performance.
-   **No Database Needed:** This simplified approach removes the need for any external database setup.
-   **Static Topic Base:** The site is built on a stable foundation of curated article topics, ensuring all URLs are permanent and SEO-friendly.
-   **Daily Homepage Refresh:** The homepage automatically shuffles topics every 24 hours to feature a new set of 4 "trending" articles from the existing cache.
