// Convierte links de YouTube/Vimeo (o un .mp4 directo) en algo embebible.
export type VideoEmbed =
  | { type: "iframe"; src: string }
  | { type: "file"; src: string };

export function toVideoEmbed(url: string): VideoEmbed | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        parsed.pathname === "/watch"
          ? parsed.searchParams.get("v")
          : parsed.pathname.startsWith("/embed/")
            ? parsed.pathname.split("/embed/")[1]
            : parsed.pathname.startsWith("/shorts/")
              ? parsed.pathname.split("/shorts/")[1]
              : null;
      if (id) return { type: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return { type: "iframe", src: `https://www.youtube.com/embed/${id}` };
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return { type: "iframe", src: `https://player.vimeo.com/video/${id}` };
    }

    if (host === "player.vimeo.com") {
      return { type: "iframe", src: trimmed };
    }

    if (/\.(mp4|webm|ogg)$/i.test(parsed.pathname)) {
      return { type: "file", src: trimmed };
    }
  } catch {
    return null;
  }

  return null;
}
