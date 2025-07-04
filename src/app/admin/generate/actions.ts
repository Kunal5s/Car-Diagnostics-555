'use server';

import { populateAllArticles } from '@/ai/flows/populate-articles';

export async function triggerGeneration() {
  // This function is a server action that can be called from the client.
  // It securely triggers the long-running generation process on the server.
  // We don't await the result here on the server, allowing the client to get an immediate response.
  // The flow itself will run in the background.
  populateAllArticles();
  return { success: true, message: "Article generation process has been started. It will run in the background and may take up to 10 minutes. You can now close this page." };
}
