import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Check if credentials are meaningfully configured
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes('your-project') ||
    supabaseUrl.includes('placeholder') ||
    supabaseAnonKey.includes('your-anon-public-key') ||
    supabaseAnonKey.length < 20
  ) {
    return false;
  }
  return true;
};

// Singleton client instance
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('[VibeReview] Failed to initialize Supabase client:', err);
    supabaseClient = null;
  }
}

export const supabase = supabaseClient;

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url: string | null;
  mode: 'real_supabase' | 'demo_local_store';
  storageAvailable: boolean;
  authAvailable: boolean;
}

export const getSupabaseStatus = (): SupabaseConfigStatus => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    url: configured ? supabaseUrl! : null,
    mode: configured ? 'real_supabase' : 'demo_local_store',
    storageAvailable: configured,
    authAvailable: configured,
  };
};
