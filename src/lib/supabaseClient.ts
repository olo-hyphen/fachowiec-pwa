// Safe Supabase client wrapper with fallbacks for missing envs
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

// Fallback: construct URL from project id if direct URL is not provided
const SUPABASE_URL = envUrl || (projectId ? `https://${projectId}.supabase.co` : undefined);
const SUPABASE_PUBLISHABLE_KEY = envKey;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // Provide a clear runtime error to help diagnose env issues
  // Avoid logging sensitive key values
  // eslint-disable-next-line no-console
  console.error('[Supabase config] Missing configuration', {
    hasUrl: Boolean(SUPABASE_URL),
    hasKey: Boolean(SUPABASE_PUBLISHABLE_KEY),
    projectIdPresent: Boolean(projectId),
  });
  throw new Error('Supabase is not configured. Please ensure SUPABASE URL and PUBLISHABLE KEY are set.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
