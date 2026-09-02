"use client";

import { useState, useTransition } from "react";
import { Trash2, ExternalLink } from "lucide-react";
import type { Client } from "@/lib/clients";
import { deleteClient } from "./actions";

export function ClientRow({ client }: { client: Client }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!confirm(`¿Eliminar "${client.name}"? Esto también borra su logo.`)) {
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await deleteClient(client.id, client.logo_url);
      if (!result.ok) {
        setError(result.error ?? "No se pudo eliminar.");
      }
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.logo_url}
          alt={client.name}
          className="h-12 w-24 shrink-0 rounded bg-background object-contain p-1"
        />
        <div className="min-w-0">
          <p className="truncate font-body text-sm font-semibold text-foreground">
            {client.name}
          </p>
          {client.website_url && (
            <a
              href={client.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 truncate font-body text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3 shrink-0" />
              {client.website_url}
            </a>
          )}
          {error && (
            <p className="font-body text-xs text-destructive">{error}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-destructive disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
        {isPending ? "Eliminando…" : "Eliminar"}
      </button>
    </div>
  );
}
