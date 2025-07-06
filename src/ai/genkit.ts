import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': 'https://oudworkstations.dev',
        'X-Title': 'Car Diagnostics BrainAi',
      },
    }),
  ],
  model: 'google/gemini-2.5-flash-lite-preview-06-17',
});
