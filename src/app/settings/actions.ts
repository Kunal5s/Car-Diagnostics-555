'use server';

import { triggerArticleGeneration as generate } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export async function triggerArticleGeneration() {
  console.log("Server action 'triggerArticleGeneration' called.");
  const result = await generate();
  if (result.success) {
    revalidatePath('/', 'layout');
  }
  return result;
}
