
import {genkit, type GenkitErrorCode} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

class GenkitError extends Error {
  constructor(
    public readonly code: GenkitErrorCode,
    message?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'GenkitError';
  }
}

// Quietly log un-configured API key errors, but don't throw.
let errorOnce = false;
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  const err = new GenkitError(
    'unconfigured',
    'GOOGLE_API_KEY environment variable not set'
  );
  if (!errorOnce) {
    console.error(err.message, {code: err.code});
    errorOnce = true;
  }
}

export const ai = genkit({
  plugins: [googleAI({apiKey})],
});
