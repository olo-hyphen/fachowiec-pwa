import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Prefer env vars, fallback to known publishable values provided by Lovable Cloud
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://slzouwtiabfajnwasnzl.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsem91d3RpYWJmYWpud2FzbnpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNjUyMDEsImV4cCI6MjA3NDc0MTIwMX0.pmg91icb-qZhj00PaCqSUNb12HaJu5f8ekBAtAvEHEc';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
