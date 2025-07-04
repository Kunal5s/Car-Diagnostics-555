'use server';

import { populateAllArticles } from '@/ai/flows/populate-articles';

export async function triggerGeneration() {
  // This function is a server action that can be called from the client.
  // It securely triggers the long-running generation process on the server.
  return await populateAllArticles();
}
