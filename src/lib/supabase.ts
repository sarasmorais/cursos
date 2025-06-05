import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key são necessários. Verifique o arquivo .env');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get a unique anonymous ID for the current browser
export const getAnonymousId = (): string => {
  let anonId = localStorage.getItem('courseOS_anonymousId');
  
  if (!anonId) {
    anonId = crypto.randomUUID();
    localStorage.setItem('courseOS_anonymousId', anonId);
  }
  
  return anonId;
};