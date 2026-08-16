"use client";

import { useState, useTransition } from "react";
import { updateBriefStatus } from "../actions";
import { STATUSES, STATUS_LABEL, type BriefStatus } from "@/lib/brief-status";
import { cn } from "@/lib/utils";

export function StatusSelect({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: string) {
    const prev = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      const result = await updateBriefStatus(id, next as BriefStatus);
      if (!result.ok) {
        setStatus(prev);
        setError(result.error ?? "No se pudo actualizar.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "font-body rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground",
          "focus:border-primary focus:outline-none",
          isPending && "opacity-50",
        )}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="font-body text-xs text-muted-foreground">
          Guardando…
        </span>
      )}
      {error && (
        <span className="font-body text-xs text-destructive">{error}</span>
      )}
    </div>
  );
}
