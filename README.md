
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

<br />
<div style="background-color: #ffdddd; border-left: 6px solid #f44336; padding: 15px; margin-bottom: 15px;">
  <h3 style="margin-top: 0; color: #f44336;"><strong>IMPORTANT: Critical Setup Required</strong></h3>
  <p>The automatic article generation will <strong>NOT</strong> work without setting these environment variables in your Vercel project. This is the most common reason for the cron job failing.</p>
</div>

-   **`GOOGLE_API_KEY`**: Your API key for Google AI Studio (Gemini).
    -   **Why it's needed:** This key allows the application to use the AI model to write the articles.
-   **`CRON_SECRET`**: A secret string to secure your cron job endpoint. Generate a strong, random string for this (e.g., using a password generator).
    -   **Why it's needed:** This prevents unauthorized users from running your article generation process and using your resources.
-   **`GITHUB_TOKEN`**: A GitHub Personal Access Token with `repo` scope.
    -   **Why it's needed:** This allows the application to save the newly generated articles back into your GitHub repository.
-   **`GITHUB_REPO_OWNER`**: The owner of the GitHub repository (e.g., your GitHub username).
    -   **Why it's needed:** To tell the system which GitHub account owns the repository.
-   **`GITHUB_REPO_NAME`**: The name of the GitHub repository.
    -   **Why it's needed:** To tell the system which repository to save the articles in.

<br />
<div style="background-color: #fffde7; border-left: 6px solid #fbc02d; padding: 15px; margin-bottom: 15px;">
  <h3 style="margin-top: 0; color: #c79100;"><strong>SECURITY WARNING: Protect Your GitHub Token!</strong></h3>
  <p>Your `GITHUB_TOKEN` is a secret password for your repository. <strong>NEVER</strong> share it publicly or save it directly in your code. Add it ONLY to the "Environment Variables" section in your Vercel project settings. If you accidentally expose your token, you should delete it on GitHub and generate a new one immediately.</p>
</div>

### Running the Development Server

Create a `.env.local` file for local development or add these directly to your Vercel project's "Environment Variables" section in your Vercel dashboard.

```bash
# .env.local
# IMPORTANT: This file is for local testing only. DO NOT commit this file to GitHub.
# For deployment on Vercel, you must set these variables in the Project Settings.
GOOGLE_API_KEY="your_google_api_key"
CRON_SECRET="your_secret_cron_job_string"
GITHUB_TOKEN="your_github_personal_access_token"
GITHUB_REPO_OWNER="Kunal5s"
GITHUB_REPO_NAME="Car-Diagnostics-555"
```

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Manually Triggering the Cron Job

To test the article generation process without waiting for the scheduled time, you can trigger it manually by visiting the following URL in your browser (after deployment and setting environment variables):

`https://<your-vercel-domain>/api/cron?secret=<your_cron_secret>`

---

## Troubleshooting

### Problem: New articles are not appearing automatically.

If new articles are not being generated every two hours, it is almost certainly due to one of the following issues:

1.  **Missing Environment Variables in Vercel:** The most common cause. Double-check that all five required environment variables (`GOOGLE_API_KEY`, `CRON_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`) are correctly set in your Vercel project's settings.
2.  **Incorrect GitHub Token Permissions:** Ensure your `GITHUB_TOKEN` has the full `repo` scope selected when you generate it. Without this, the system cannot write files to your repository.
3.  **Vercel Cron Job Logs:** Check the logs for your cron job in the Vercel dashboard. Go to your project, click on the "Logs" tab, and then select "Crons" from the dropdown. Any errors (like "Unauthorized" or "GitHub environment variables are not set") will appear there and will tell you exactly what is wrong.

