"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/lib/services";
import type { ProjectCategory } from "@/lib/projects";
import { createProject } from "./actions";

type Status = "idle" | "submitting" | "error";

export function CreateProjectForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const servicesRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const result = await createProject(formData);

    if (result.ok) {
      setStatus("idle");
      formRef.current?.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Algo salió mal.");
    }
  }

  // Solo rellena si el campo sigue vacío — no pisa lo que ya hayan escrito.
  function handleCategoryChange(category: ProjectCategory | "") {
    if (!servicesRef.current || servicesRef.current.value.trim() !== "") {
      return;
    }
    const defaults = SERVICE_CATEGORIES.find((c) => c.key === category);
    if (defaults) {
      servicesRef.current.value = defaults.items.join("\n");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Nombre del proyecto
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="tag"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Tag (ej: branding, web, logo)
          </label>
          <input
            id="tag"
            name="tag"
            type="text"
            required
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Categoría
          </label>
          <select
            id="category"
            name="category"
            required
            disabled={status === "submitting"}
            onChange={(event) =>
              handleCategoryChange(event.target.value as ProjectCategory | "")
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="">Selecciona…</option>
            <option value="diseño">Diseño</option>
            <option value="desarrollo">Desarrollo</option>
            <option value="audiovisual">Audiovisual</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="hero"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Imagen de hero{" "}
            <span className="text-muted-foreground/70">
              (recomendado: 1600×832px, WebP)
            </span>
          </label>
          <input
            id="hero"
            name="hero"
            type="file"
            accept="image/webp,image/png,image/jpeg"
            required
            disabled={status === "submitting"}
            className="w-full font-body text-sm text-foreground/70 file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:font-body file:text-sm file:font-medium file:text-foreground"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="paragraph_1"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Párrafo 1
          </label>
          <textarea
            id="paragraph_1"
            name="paragraph_1"
            rows={3}
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="paragraph_2"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Párrafo 2
          </label>
          <textarea
            id="paragraph_2"
            name="paragraph_2"
            rows={3}
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="services"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Servicios de este proyecto{" "}
            <span className="text-muted-foreground/70">
              (uno por línea — al elegir la categoría se precarga una lista
              base, edítala como quieras)
            </span>
          </label>
          <textarea
            id="services"
            name="services"
            ref={servicesRef}
            rows={6}
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      <p className="font-body text-xs text-muted-foreground">
        Las imágenes de galería se agregan después, editando el proyecto ya
        creado.
      </p>

      <div>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Creando…" : "Crear proyecto"}
        </Button>
      </div>

      {status === "error" && (
        <p className="font-body text-sm text-destructive">{errorMessage}</p>
      )}
    </form>
  );
}
