import { createClient } from "@supabase/supabase-js";

// service_role key: se salta RLS. Solo se importa desde código de servidor
// (server actions, server components) — nunca desde un componente cliente.
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
