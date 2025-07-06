import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. AI article generation will be disabled.');
}

// Important: The client is exported even if the keys are missing.
// This allows the application to build and run.
// The functions that use this client must handle the case where keys are not provided.
export const supabase = createClient(supabaseUrl!, supabaseKey!)
