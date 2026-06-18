import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : undefined;

export function createServiceSupabase() {
  if (!url || !serviceKey) {
    throw new Error('Supabase service key or URL missing');
  }
  console.log("URL:", url);
  console.log("KEY:", anonKey?.slice(0, 10));

  return createClient(url, serviceKey);
}