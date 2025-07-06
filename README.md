
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It uses a powerful AI system to generate fresh, in-depth articles on automotive topics daily, with a smart caching system powered by Supabase to ensure reliability and performance.

## Getting Started

This project requires three environment variables to be set up on your hosting platform (e.g., Vercel) for the AI features to work.

### Required Environment Variables

-   `GOOGLE_API_KEY`: Your API key for the Google Gemini model. You can get this from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   `SUPABASE_URL`: The URL for your Supabase project.
-   `SUPABASE_ANON_KEY`: The `anon` key for your Supabase project.

Create a `.env.local` file in the root of your project for local development:
```
GOOGLE_API_KEY="your_google_api_key_here"
SUPABASE_URL="your_supabase_url_here"
SUPABASE_ANON_KEY="your_supabase_anon_key_here"
```

### Supabase Setup

You need to create a table in your Supabase project to cache the generated articles.

1.  Go to your Supabase project dashboard.
2.  Navigate to the **SQL Editor**.
3.  Click **New query** and run the following SQL script to create the `articles` table:

```sql
CREATE TABLE articles (
    id BIGINT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Content Strategy: The Best of Both Worlds

This application uses a hybrid content strategy to provide fresh daily content while ensuring maximum reliability and performance.

-   **Dynamic AI Generation:** When a user visits an article page for the first time on any given day, the content is generated in real-time by the powerful Gemini 1.5 Pro AI model. This ensures the content is always fresh, unique, and in-depth.
-   **Supabase Smart Caching:** Once an article is generated, it is automatically saved (cached) in your Supabase database for 24 hours. Any other user who visits that same article on the same day will be served the content instantly from the Supabase cache, not from the AI.
-   **Reliability & Performance:** This "generate-once, serve-many" approach dramatically reduces API calls, lowers costs, and ensures the site is fast and reliable, avoiding the errors and timeouts common with live AI generation on every page load.
```
-   **Static Topic Base:** The site is built on a stable foundation of 54 curated article topics. This ensures that all category pages and article URLs are permanent and SEO-friendly.
-   **Daily Homepage Refresh:** To keep the experience fresh, the homepage automatically shuffles the article topics every 24 hours to feature a new set of 6 "trending" articles.

This hybrid model provides the dynamic, AI-powered content you want with the stability and performance that a professional website requires.
