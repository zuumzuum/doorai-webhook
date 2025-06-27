import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Check if we have valid Supabase credentials
const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseUrl !== 'https://demo.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseAnonKey !== 'placeholder-key' &&
  supabaseAnonKey !== 'demo-key' &&
  supabaseUrl.includes('.supabase.co') &&
  supabaseAnonKey.length > 20; // Real Supabase keys are much longer

if (!hasValidCredentials) {
  throw new Error('Supabase credentials are not properly configured. Please check your .env.local file.');
}

// Create the real Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});