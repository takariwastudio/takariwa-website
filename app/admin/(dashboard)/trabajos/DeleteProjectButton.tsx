"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProject } from "./actions";

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (
      !confirm(
        `¿Eliminar "${title}"? Esto también borra su hero y todas las imágenes de galería.`,
      )
    ) {
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await deleteProject(id);
      if (!result.ok) {
        setError(result.error ?? "No se pudo eliminar.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-destructive disabled:opacity-50"
      >
        <Trash2 className="size-3.5" />
        {isPending ? "Eliminando…" : "Eliminar"}
      </button>
      {error && <p className="font-body text-xs text-destructive">{error}</p>}
    </div>
  );
}
