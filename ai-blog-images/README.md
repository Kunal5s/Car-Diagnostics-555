# AI Blog Images Script

This script is intended to programmatically generate or fetch images for your blog articles and commit them directly to your GitHub repository.

## Setup

1.  **Install Dependencies:** Navigate to this directory and run `npm install`:
    ```bash
    cd ai-blog-images
    npm install
    ```

2.  **Set Environment Variables:** This script requires a GitHub Personal Access Token with `repo` scope. It is recommended to create a `.env` file in the root of the main project directory (not inside this folder) and add your token. The script will not work without it.
    ```
    GITHUB_TOKEN="your_github_personal_access_token_here"
    ```

3.  **Configure the Script:** Open `generateAndPush.js` and fill in the following configuration variables:
    *   `GITHUB_OWNER`: Your GitHub username or organization name.
    *   `GITHUB_REPO`: The name of your repository.
    *   `GIT_BRANCH`: The branch you want to commit the images to (e.g., `main`).

## Usage

Once configured, you can run the script from this directory:

```bash
node generateAndPush.js
```

You will need to implement the logic inside the `main()` function to fetch your articles, generate images for them, and call the `commitFileToGitHub` helper function.
