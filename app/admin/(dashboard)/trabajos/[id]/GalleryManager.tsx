"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addProjectImages, deleteProjectImage } from "../actions";

type ProjectImage = {
  id: string;
  image_url: string;
};

type AddStatus = "idle" | "submitting" | "error";

export function GalleryManager({
  projectId,
  images,
}: {
  projectId: string;
  images: ProjectImage[];
}) {
  const [addStatus, setAddStatus] = useState<AddStatus>("idle");
  const [addError, setAddError] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddStatus("submitting");
    setAddError("");

    const formData = new FormData(event.currentTarget);
    const result = await addProjectImages(projectId, formData);

    if (result.ok) {
      setAddStatus("idle");
      setSelectedCount(0);
      formRef.current?.reset();
    } else {
      setAddStatus("error");
      setAddError(result.error ?? "No se pudieron agregar las imágenes.");
    }
  }

  function handleDelete(imageId: string, imageUrl: string) {
    if (!confirm("¿Quitar esta imagen de la galería?")) return;
    setDeletingId(imageId);
    startTransition(async () => {
      await deleteProjectImage(imageId, projectId, imageUrl);
      setDeletingId(null);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 font-body text-sm font-semibold text-foreground">
        Galería ({images.length})
      </p>

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-video overflow-hidden rounded-lg bg-background"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.image_url}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(image.id, image.image_url)}
                disabled={isPending && deletingId === image.id}
                aria-label="Quitar imagen"
                className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-ink/80 text-paper opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive disabled:opacity-100"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleAdd}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <input
          name="images"
          type="file"
          accept="image/webp,image/png,image/jpeg"
          multiple
          required
          onChange={(event) =>
            setSelectedCount(event.target.files?.length ?? 0)
          }
          disabled={addStatus === "submitting"}
          className="flex-1 font-body text-sm text-foreground/70 file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:font-body file:text-sm file:font-medium file:text-foreground"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={addStatus === "submitting"}
        >
          {addStatus === "submitting"
            ? "Subiendo…"
            : selectedCount > 1
              ? `Agregar ${selectedCount} imágenes`
              : "Agregar imagen"}
        </Button>
      </form>
      <p className="mt-2 font-body text-xs text-muted-foreground">
        Puedes seleccionar varias imágenes a la vez (Ctrl/Cmd + clic, o
        arrastrando la selección).
      </p>
      {addStatus === "error" && (
        <p className="mt-2 font-body text-sm text-destructive">{addError}</p>
      )}
    </div>
  );
}
