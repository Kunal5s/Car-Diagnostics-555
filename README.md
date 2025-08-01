
# Car Diagnostics AI

This is a Next.js application built in Firebase Studio. It features a fully automated content pipeline that uses AI to generate and publish new articles daily.

## Fully Automated Architecture (Vercel Cron + GitHub + Vercel Deploy Hooks)

This application is designed for a "set it and forget it" content strategy, ensuring the site remains fresh and up-to-date with minimal human intervention.

-   **Automated Content Generation**: A Vercel Cron Job runs automatically on a schedule. Each run generates a new, in-depth automotive article.
-   **AI-Powered**: The cron job uses Google's Gemini model via Genkit to create high-quality, SEO-friendly articles complete with a relevant hero image.
-   **Git as CMS**: Generated articles are saved as individual JSON files directly into the `/_articles` directory of this GitHub repository. This acts as a permanent, version-controlled database.
-   **Automatic Redeployment**: After committing a new article, the cron job automatically triggers a Vercel Deploy Hook. This tells Vercel to start a new deployment, ensuring the latest content is always live.
-   **Fast & Reliable**: The Next.js application reads directly from the local `/_articles` files at build time. This makes the website extremely fast and reliable, with no external database or complex data-fetching logic during a user's visit.

## Getting Started

To run this project, you need to set up the following environment variables in your Vercel project settings.

### Required Environment Variables

<br />
<div style="background-color: #ffdddd; border-left: 6px solid #f44336; padding: 15px; margin-bottom: 15px;">
  <h3 style="margin-top: 0; color: #f44336;"><strong>IMPORTANT: Critical Setup Required</strong></h3>
  <p>The automatic article generation and deployment will <strong>NOT</strong> work without setting these environment variables in your Vercel project. This is the most common reason for the cron job failing. After setting them, you must <strong>REDEPLOY</strong> your application for the changes to take effect.</p>
</div>

-   **`GOOGLE_API_KEY`**: Your API key for Google AI Studio (Gemini).
    -   **Why it's needed:** This key allows the application to use the AI model to write the articles.
-   **`CRON_SECRET`**: A secret string to secure your cron job endpoint. Generate a strong, random string for this (e.g., `MySuperSecretKey123`). Avoid using special characters like `@`, `#`, `&`, `?` as they can cause issues in URLs.
    -   **Why it's needed:** This prevents unauthorized users from running your article generation process and using your resources.
-   **`GITHUB_TOKEN`**: A GitHub Personal Access Token with `repo` scope.
    -   **Why it's needed:** This allows the application to save the newly generated articles back into your GitHub repository.
-   **`GITHUB_REPO_OWNER`**: The owner of the GitHub repository (e.g., your GitHub username).
    -   **Why it's needed:** To tell the system which GitHub account owns the repository.
-   **`GITHUB_REPO_NAME`**: The name of the GitHub repository. For this project, it should be `Car-Diagnostics-555`.
    -   **Why it's needed:** To tell the system which repository to save the articles in.
-   **`VERCEL_DEPLOY_HOOK_URL`**: A special URL from Vercel that starts a new deployment when called.
    -   **Why it's needed:** This is the key to automatically publishing new articles. After the cron job saves an article to GitHub, it calls this URL to tell Vercel to update the live website with the new content.
    -   **How to get it:** In your Vercel project dashboard, go to **Settings** -> **Deploy Hooks**. Create a new hook (give it a name like "Cron Job Trigger") for your `main` or `master` branch. Vercel will give you a URL to use for this variable.

<br />
<div style="background-color: #fffde7; border-left: 6px solid #fbc02d; padding: 15px; margin-bottom: 15px;">
  <h3 style="margin-top: 0; color: #c79100;"><strong>SECURITY WARNING: Protect Your Secrets!</strong></h3>
  <p>Your `GITHUB_TOKEN`, `CRON_SECRET`, and `VERCEL_DEPLOY_HOOK_URL` are secret passwords. <strong>NEVER</strong> share them publicly or save them directly in your code. Add them ONLY to the "Environment Variables" section in your Vercel project settings.</p>
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
GITHUB_REPO_OWNER="your_github_username"
GITHUB_REPO_NAME="Car-Diagnostics-555"
VERCEL_DEPLOY_HOOK_URL="your_vercel_deploy_hook_url"
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

If new articles are not being generated and published, it is almost certainly due to one of the following issues:

1.  **Missing or Incorrect Environment Variables in Vercel:** The most common cause. Double-check that all **six** required environment variables (`GOOGLE_API_KEY`, `CRON_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`, `VERCEL_DEPLOY_HOOK_URL`) are correctly set in your Vercel project's settings.
2.  **Incorrect GitHub Token Permissions:** Ensure your `GITHUB_TOKEN` has the full `repo` scope selected when you generate it. Without this, the system cannot write files to your repository.
3.  **Deployment Not Redeployed:** After adding or changing environment variables in Vercel, you **must redeploy** your application for the new settings to apply.
4.  **Vercel Cron Job Logs:** Check the logs for your cron job in the Vercel dashboard. Go to your project, click on the "Logs" tab, and then select "Crons" from the dropdown. Any errors (like "Unauthorized" or "GitHub environment variables are not set") will appear there and will tell you exactly what is wrong.

### Problem: The cron job URL shows 'Unauthorized'.

This means the `secret` you provided in the URL does not match the `CRON_SECRET` variable in Vercel.
1.  **Check for Typos:** Make sure you typed the secret correctly in the URL.
2.  **Avoid Special Characters:** Sometimes, special characters (like `@`, `#`, `&`, `?`) can cause problems in a URL. Try changing your `CRON_SECRET` in Vercel to something simpler that only uses letters and numbers (e.g., `MySecretKey12345`), redeploy, and try the URL again with the new secret.
3.  **Ensure Redeployment:** Remember to redeploy after changing the `CRON_SECRET` in Vercel.
