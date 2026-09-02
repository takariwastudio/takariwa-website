import { createBrowserSupabase } from "@/lib/supabase/client";

export type Client = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
};

// Usa la anon key (createBrowserSupabase) a propósito, aunque se llame
// desde un server component: es una lectura pública, y así respeta el
// mismo RLS ("Cualquiera puede leer clientes") que protegería esta tabla
// si algún día se llama desde el cliente también.
export async function getClients(): Promise<Client[]> {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("clients")
    .select("id, name, logo_url, website_url")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error obteniendo clientes:", error);
    return [];
  }

  return data ?? [];
}
