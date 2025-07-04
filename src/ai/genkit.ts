import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// It will automatically use the GOOGLE_API_KEY from your .env file.
export const ai = genkit({
  plugins: [
    googleAI({
      // Specify the API version to ensure stability.
      apiVersion: 'v1beta',
    }),
  ],
});
