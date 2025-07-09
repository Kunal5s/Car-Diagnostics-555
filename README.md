
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It features a fully automated content pipeline that uses AI to generate and publish new articles daily.

## Fully Automated Architecture (Vercel Cron + GitHub)

This application is designed for a "set it and forget it" content strategy, ensuring the site remains fresh and up-to-date with minimal human intervention.

-   **High-Frequency Content Generation**: Vercel Cron Jobs run automatically every two hours. Each run generates **two new articles**, resulting in up to **24 new, in-depth automotive articles daily**.
-   **AI-Powered**: The cron job uses Google's Gemini model via Genkit to create high-quality, SEO-friendly articles complete with a relevant hero image.
-   **Git as CMS**: Generated articles are saved as individual JSON files directly into the `/_articles` directory of this GitHub repository. This acts as a permanent, version-controlled database.
-   **Automatic Redeployment**: Committing a new article to the repository automatically triggers a new deployment on Vercel, ensuring the latest content is always live.
-   **Fast & Reliable**: The Next.js application reads directly from the local `/_articles` files at build time. This makes the website extremely fast and reliable, with no external database or complex data-fetching logic during a user's visit.

## Getting Started

To run this project, you need to set up the following environment variables in your Vercel project settings.

### Required Environment Variables

Create a `.env.local` file for local development or add these directly to your Vercel project's "Environment Variables" section.

-   `GOOGLE_API_KEY`: Your API key for Google AI Studio (Gemini).
-   `CRON_SECRET`: A secret string to secure your cron job endpoint. Generate a strong, random string for this.
-   `GITHUB_TOKEN`: A GitHub Personal Access Token with `repo` scope to allow the cron job to commit articles to the repository.
-   `GITHUB_REPO_OWNER`: The owner of the GitHub repository (e.g., your GitHub username).
-   `GITHUB_REPO_NAME`: The name of the GitHub repository.

```bash
# .env.local
GOOGLE_API_KEY="your_google_api_key"
CRON_SECRET="your_secret_cron_job_string"
GITHUB_TOKEN="your_github_personal_access_token"
GITHUB_REPO_OWNER="your_github_username"
GITHUB_REPO_NAME="your_github_repository_name"
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Manually Triggering the Cron Job

To test the article generation process without waiting for the scheduled time, you can trigger it manually by visiting the following URL in your browser (after deployment):

`https://<your-vercel-domain>/api/cron?secret=<your_cron_secret>`
