import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file configures the AI models and plugins.
// It is NOT a server action and should not export functions directly.
// The 'use server' directive is used in the flow files that import 'ai'.

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyDM0rK_YM9MynGMNogRPfqxCuiIdoLNAOI',
    }),
  ],
});
