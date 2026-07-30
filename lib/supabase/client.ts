import { createClient } from "@supabase/supabase-js";

// anon key — solo tiene permiso de INSERT sobre "briefs" (ver supabase/schema.sql).
export function createBrowserSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
