import { createClient } from '@supabase/supabase-js';

// Tanda seru (!) ngasih tau TypeScript kalau variabel ENV ini pasti ada
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);