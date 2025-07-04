'use server';
import { refreshCategoryArticles } from '@/ai/flows/refresh-category-articles';

export async function triggerCategoryRefresh(categoryName: string) {
  // This function is a server action that can be called from the client.
  // It securely triggers the long-running generation process on the server.
  // We don't await the result here, allowing the client to get an immediate response.
  // The flow itself will run in the background.
  refreshCategoryArticles(categoryName);
  return { success: true, message: "Category refresh process has been started in the background." };
}
