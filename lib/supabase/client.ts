import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase.glamstep.internal';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-supabase') &&
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('mock-anon-key')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
