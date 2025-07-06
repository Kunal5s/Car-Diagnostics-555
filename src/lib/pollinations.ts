'use server';

export async function getPollinationsImage(query: string): Promise<string> {
  // Pollinations works best with more descriptive prompts
  const fullPrompt = `${query}, car, automotive, cinematic, photorealistic, hd`;
  const encodedPrompt = encodeURIComponent(fullPrompt);
  // Use the 720px width as requested previously for better performance
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=720&height=405&nologo=true`;
}
