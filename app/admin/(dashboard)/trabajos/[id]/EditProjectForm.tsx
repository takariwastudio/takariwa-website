"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { ProjectCategory } from "@/lib/projects";
import { updateProject } from "../actions";

type Status = "idle" | "submitting" | "saved" | "error";

export function EditProjectForm({
  id,
  title,
  tag,
  category,
  paragraph1,
  paragraph2,
  services,
}: {
  id: string;
  title: string;
  tag: string;
  category: ProjectCategory;
  paragraph1: string;
  paragraph2: string;
  services: string[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const result = await updateProject(id, formData);

    if (result.ok) {
      setStatus("saved");
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Algo salió mal.");
    }
  }

  return (
    <form
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
            defaultValue={title}
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="tag"
            className="mb-1 block font-body text-xs font-medium text-muted-foreground"
          >
            Tag
          </label>
          <input
            id="tag"
            name="tag"
            type="text"
            required
            defaultValue={tag}
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
            defaultValue={category}
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          >
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
            Reemplazar imagen de hero (opcional){" "}
            <span className="text-muted-foreground/70">
              (recomendado: 1600×832px, WebP)
            </span>
          </label>
          <input
            id="hero"
            name="hero"
            type="file"
            accept="image/webp,image/png,image/jpeg"
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
            defaultValue={paragraph1}
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
            defaultValue={paragraph2}
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
            <span className="text-muted-foreground/70">(uno por línea)</span>
          </label>
          <textarea
            id="services"
            name="services"
            rows={6}
            defaultValue={services.join("\n")}
            disabled={status === "submitting"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 font-body text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Guardando…" : "Guardar cambios"}
        </Button>
        {status === "saved" && (
          <p className="font-body text-sm text-muted-foreground">Guardado.</p>
        )}
        {status === "error" && (
          <p className="font-body text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    </form>
  );
}
