import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY})],
  // Use a fast and capable model from the Gemini 1.5 family.
  model: 'googleai/gemini-1.5-flash-latest',
});
