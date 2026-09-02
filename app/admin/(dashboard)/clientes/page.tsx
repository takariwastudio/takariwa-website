import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Client } from "@/lib/clients";
import { AddClientForm } from "./AddClientForm";
import { ClientRow } from "./ClientRow";

export const metadata: Metadata = {
  title: "Clientes | Admin",
};

export default async function AdminClientesPage() {
  const supabase = createServerSupabase();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, logo_url, website_url")
    .order("created_at", { ascending: true })
    .returns<Client[]>();

  if (error) {
    console.error("Error obteniendo clientes:", error);
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <p className="font-body text-[0.7rem] tracking-[0.2em] text-accent uppercase">
        Takariwa Studio
      </p>
      <h1 className="font-display mt-1 mb-2 text-3xl tracking-wide text-foreground sm:text-4xl">
        Clientes
      </h1>
      <p className="mb-6 font-body text-sm text-muted-foreground md:mb-8">
        Los logos que agregues acá aparecen automáticamente en &quot;Nuestros
        clientes&quot; del homepage.
      </p>

      <AddClientForm />

      <div className="mt-6 flex flex-col gap-3">
        {(clients ?? []).map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}

        {(clients ?? []).length === 0 && (
          <p className="font-body text-sm text-muted-foreground">
            Todavía no hay clientes agregados.
          </p>
        )}
      </div>
    </div>
  );
}
