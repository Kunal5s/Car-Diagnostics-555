import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fefoagehpraawvfzzoag.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZm9hZ2VocHJhYXd2Znp6b2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODc3NDUsImV4cCI6MjA2NzM2Mzc0NX0.8wpL7EfVzFTMY5UmErVFHL5KlOX2_tSwfe06MUJXvAA';

export const supabase = createClient(supabaseUrl, supabaseKey);
