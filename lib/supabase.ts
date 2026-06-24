import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error("Supabase env vars missing");
}

export const supabase = createClient(url, anonKey);

export function createServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase service key or URL missing');
  }
  console.log("URL:", url);
  console.log("KEY:", anonKey?.slice(0, 10));

  return createClient(url, serviceKey);
}