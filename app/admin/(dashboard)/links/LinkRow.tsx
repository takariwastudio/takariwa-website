"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function LinkRow({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("No se pudo copiar el link:", err);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      <code className="min-w-0 flex-1 truncate rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground/80">
        {url}
      </code>

      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs font-semibold transition-colors",
            copied
              ? "border-transparent bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-muted hover:text-foreground",
          )}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-body text-xs font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="size-3.5" />
          Abrir
        </a>
      </div>
    </div>
  );
}
