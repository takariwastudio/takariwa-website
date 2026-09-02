"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { addClient } from "./actions";

type Status = "idle" | "submitting" | "error";

export function AddClientForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const result = await addClient(formData);

    if (result.ok) {
      setStatus("idle");
      formRef.current?.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Algo salió mal.");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="name"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="website_url"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Web (opcional)
          </label>
          <input
            id="website_url"
            name="website_url"
            type="url"
            placeholder="https://"
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="logo"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Logo
          </label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/webp,image/png,image/svg+xml"
            required
            disabled={status === "submitting"}
            className="w-full font-body text-sm text-foreground/70 file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:font-body file:text-sm file:font-medium file:text-foreground"
          />
        </div>

        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Guardando…" : "Agregar cliente"}
        </Button>
      </div>

      {status === "error" && (
        <p className="mt-3 font-body text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
