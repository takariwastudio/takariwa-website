"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { createBrowserSupabase } from "@/lib/supabase/client";
import {
  emptyFormData,
  type BriefFormData,
  type BriefType,
  type DoneConfig,
  type FieldDef,
  type IntroConfig,
  type StepDef,
} from "./types";
import { submitBrief } from "./actions";

const ACCENTS = ["yellow", "orange", "magenta", "purple", "blue"] as const;
type Accent = (typeof ACCENTS)[number];

const CHIP_BG: Record<Accent, string> = {
  yellow: "bg-yellow",
  orange: "bg-orange",
  magenta: "bg-magenta",
  purple: "bg-purple",
  blue: "bg-blue",
};
const CHIP_TEXT: Record<Accent, string> = {
  yellow: "text-ink",
  orange: "text-ink",
  magenta: "text-paper",
  purple: "text-paper",
  blue: "text-paper",
};
const TEXT_ACCENT: Record<Accent, string> = {
  yellow: "text-yellow",
  orange: "text-orange",
  magenta: "text-magenta",
  purple: "text-purple",
  blue: "text-blue",
};

interface FlatQuestion {
  field: FieldDef;
  section: StepDef;
  sectionIndex: number;
}

function flattenQuestions(steps: StepDef[]): FlatQuestion[] {
  return steps.flatMap((section, sectionIndex) =>
    section.fields.map((field) => ({ field, section, sectionIndex })),
  );
}

function validateField(
  field: FieldDef,
  value: string | string[] | undefined,
): string | null {
  if (!field.required) return null;

  if (field.type === "checkbox-group" || field.type === "file") {
    if (!Array.isArray(value) || value.length === 0) {
      return field.type === "file"
        ? "Sube al menos un archivo."
        : "Selecciona al menos una opción.";
    }
    return null;
  }
  if (field.type === "radio-group") {
    if (!value) return "Selecciona una opción.";
    return null;
  }

  const str = String(value ?? "").trim();
  if (!str) return "Este campo es obligatorio.";
  if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    return "Ingresa un correo válido.";
  }
  return null;
}

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, y: dir >= 0 ? 24 : -24 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir >= 0 ? -24 : 24 }),
};

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
        fill="currentColor"
      />
      <path
        d="M12.03 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 4.99L2 22l5.19-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.53 2 12.03 2Zm0 18.2h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-3.08.81.82-3-.2-.31a8.28 8.28 0 1 1 6.97 3.83Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.5 6.5 12 12.75l8.5-6.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.75"
        y="2.75"
        width="18.5"
        height="18.5"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M7.6 10.2v6.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="7.6" cy="7.4" r="1.15" fill="currentColor" />
      <path
        d="M10.9 16.8v-4.1c0-1.4.85-2.5 2.25-2.5 1.35 0 2.15.9 2.15 2.55v4.05"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9 10.2v6.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: "https://wa.me/584226340416", Icon: WhatsAppIcon },
  { label: "Correo", href: "mailto:hola@takariwa.studio", Icon: MailIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com/takariwa.studio",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/takariwa-studio/",
    Icon: LinkedInIcon,
  },
];

interface BriefFormProps {
  briefType: BriefType;
  steps: StepDef[];
  intro: IntroConfig;
  done: DoneConfig;
}

export default function BriefForm({
  briefType,
  steps,
  intro,
  done,
}: BriefFormProps) {
  const questions = useMemo(() => flattenQuestions(steps), [steps]);
  const total = questions.length;

  const [qIndex, setQIndex] = useState(-1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<BriefFormData>(() => emptyFormData(steps));
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const isIntro = qIndex === -1;
  const isReview = qIndex === total;
  const current = !isIntro && !isReview ? questions[qIndex] : null;
  const accent: Accent = ACCENTS[(current?.sectionIndex ?? 0) % ACCENTS.length];

  // Ref callback en vez de useEffect + ref fija: con AnimatePresence
  // mode="wait", el nuevo campo no existe en el DOM todavía cuando un
  // useEffect dispararía (espera a que la pregunta anterior termine de
  // desvanecerse). Una ref callback sí se ejecuta en el instante exacto en
  // que ESE input se monta, sin importar cuándo termine la animación.
  function autoFocusRef(el: HTMLInputElement | HTMLTextAreaElement | null) {
    el?.focus();
  }

  function setField(id: string, value: string | string[]) {
    setData((prev) => ({ ...prev, [id]: value }));
    setError(null);
  }

  function toggleCheckbox(id: string, option: string) {
    const list = (data[id] as string[]) ?? [];
    const next = list.includes(option)
      ? list.filter((o) => o !== option)
      : [...list, option];
    setField(id, next);
  }

  async function handleFileSelect(field: FieldDef, files: FileList | null) {
    if (!files || files.length === 0) return;
    const current = (data[field.id] as string[]) ?? [];
    const room = (field.maxFiles ?? 3) - current.length;
    const toUpload = Array.from(files).slice(0, Math.max(0, room));
    if (toUpload.length === 0) return;

    setUploading((u) => ({ ...u, [field.id]: true }));
    const supabase = createBrowserSupabase();
    const uploaded: string[] = [];

    for (const file of toUpload) {
      const path = `${briefType}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("brief-uploads")
        .upload(path, file);
      if (uploadError) {
        console.error("Error subiendo archivo:", uploadError);
        continue;
      }
      const { data: pub } = supabase.storage
        .from("brief-uploads")
        .getPublicUrl(path);
      uploaded.push(pub.publicUrl);
    }

    setField(field.id, [...current, ...uploaded]);
    setUploading((u) => ({ ...u, [field.id]: false }));
  }

  function removeFile(fieldId: string, url: string) {
    const list = (data[fieldId] as string[]) ?? [];
    setField(
      fieldId,
      list.filter((u) => u !== url),
    );
  }

  function goNext() {
    if (current) {
      const msg = validateField(current.field, data[current.field.id]);
      if (msg) {
        setError(msg);
        return;
      }
    }
    setDirection(1);
    setError(null);
    setQIndex((i) => Math.min(total, i + 1));
  }

  function goBack() {
    setDirection(-1);
    setError(null);
    setQIndex((i) => Math.max(-1, i - 1));
  }

  function selectRadio(id: string, option: string) {
    setField(id, option);
    window.setTimeout(() => goNext(), 320);
  }

  async function handleSubmit() {
    setStatus("submitting");
    setSubmitError(null);
    const result = await submitBrief(briefType, data);
    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setSubmitError(result.error ?? "Algo salió mal.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-body text-[0.7rem] tracking-[0.24em] text-yellow uppercase md:text-xs md:tracking-[0.28em]">
            {done.eyebrow}
          </span>
          <h1 className="headline font-display mt-3 text-[2.75rem] leading-[0.92] text-paper sm:text-[4rem]">
            <span data-text={done.headline}>{done.headline}</span>
          </h1>
          <p className="mt-4 max-w-md font-body text-[0.95rem] leading-relaxed text-paper/80">
            {done.body.replace("{{email}}", String(data.email))}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-dvh flex-col"
      onKeyDown={(e) => {
        if (e.key === "Escape") goBack();
      }}
    >
      {/* <header className="flex shrink-0 items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <img
          src="/logo.svg"
          alt="Takariwa Studio"
          className="h-6 w-auto md:h-7"
        />
        <Link
          href="/"
          className="rounded-full border border-paper/15 px-4 py-2 font-body text-xs font-semibold text-paper transition-transform hover:-translate-y-0.5"
        >
          Volver al inicio
        </Link>
      </header> */}

      <main className="flex flex-1 items-center justify-center px-6 py-6">
        <div className="w-full max-w-2xl">
          {/* {!isIntro && (
            <div className="mb-10 flex items-center gap-2">
              {Array.from({ length: total + 1 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= qIndex
                      ? CHIP_BG[
                          ACCENTS[
                            (questions[Math.min(i, total - 1)]?.sectionIndex ??
                              0) % ACCENTS.length
                          ]
                        ]
                      : "bg-paper/10"
                  }`}
                />
              ))}
            </div>
          )} */}

          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              {isIntro && (
                <motion.section
                  key="intro"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <span className="font-body text-[0.7rem] tracking-[0.24em] text-yellow uppercase md:text-xs md:tracking-[0.28em]">
                    {intro.eyebrow}
                  </span>
                  <h1 className="headline font-display mt-3 text-[2.5rem] leading-[0.95] text-paper sm:text-[3.5rem]">
                    <span data-text={intro.headline}>{intro.headline}</span>
                  </h1>
                  {intro.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className={`max-w-xl font-body text-[0.95rem] leading-relaxed text-paper/75 md:text-base ${i === 0 ? "mt-5" : "mt-3"}`}
                    >
                      {p}
                    </p>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setDirection(1);
                      setQIndex(0);
                    }}
                    className="mt-8 w-fit rounded-full bg-yellow px-6 py-3 font-body text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
                  >
                    {intro.ctaLabel}
                  </button>
                </motion.section>
              )}

              {current && (
                <motion.section
                  key={current.field.id}
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`font-body text-xs font-semibold tracking-wide ${TEXT_ACCENT[accent]}`}
                    >
                      {current.section.number} · {current.section.title}
                    </span>
                  </div>

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <label
                      htmlFor={current.field.id}
                      className="font-display text-2xl leading-tight text-paper sm:text-3xl"
                    >
                      {current.field.label}
                    </label>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 font-body text-[0.65rem] font-semibold tracking-wide uppercase ${
                        current.field.required
                          ? `${CHIP_BG[accent]} ${CHIP_TEXT[accent]}`
                          : "bg-paper/10 text-paper/50"
                      }`}
                    >
                      {current.field.required ? "Obligatorio" : "Opcional"}
                    </span>
                  </div>

                  {current.field.hint && (
                    <p className="mb-4 -mt-3 font-body text-sm text-paper/50 italic">
                      {current.field.hint}
                    </p>
                  )}

                  {current.field.type === "textarea" && (
                    <textarea
                      ref={autoFocusRef}
                      id={current.field.id}
                      rows={3}
                      value={(data[current.field.id] as string) ?? ""}
                      onChange={(e) =>
                        setField(current.field.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          goNext();
                        }
                      }}
                      className="w-full resize-none border-b-2 border-paper/15 bg-transparent py-3 font-body text-lg text-paper placeholder:text-paper/25 focus:border-yellow focus:outline-none"
                    />
                  )}

                  {(current.field.type === "text" ||
                    current.field.type === "email" ||
                    current.field.type === "tel" ||
                    current.field.type === "date") && (
                    <input
                      ref={autoFocusRef}
                      id={current.field.id}
                      type={current.field.type}
                      value={(data[current.field.id] as string) ?? ""}
                      onChange={(e) =>
                        setField(current.field.id, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          goNext();
                        }
                      }}
                      className="w-full border-b-2 border-paper/15 bg-transparent py-3 font-body text-lg text-paper placeholder:text-paper/25 focus:border-yellow focus:outline-none"
                    />
                  )}

                  {current.field.type === "checkbox-group" && (
                    <div className="flex flex-wrap gap-2">
                      {current.field.options?.map((opt) => {
                        const checked = (
                          (data[current.field.id] as string[]) ?? []
                        ).includes(opt);
                        return (
                          <button
                            type="button"
                            key={opt}
                            aria-pressed={checked}
                            onClick={() =>
                              toggleCheckbox(current.field.id, opt)
                            }
                            className={`rounded-full border px-4 py-2.5 font-body text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper focus-visible:outline-offset-2 ${
                              checked
                                ? `border-transparent ${CHIP_BG[accent]} ${CHIP_TEXT[accent]} font-semibold`
                                : "border-paper/15 text-paper hover:border-paper/40"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {current.field.type === "radio-group" && (
                    <div className="flex flex-wrap gap-2">
                      {current.field.options?.map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          aria-pressed={data[current.field.id] === opt}
                          onClick={() => selectRadio(current.field.id, opt)}
                          className={`rounded-full border px-4 py-2.5 font-body text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper focus-visible:outline-offset-2 ${
                            data[current.field.id] === opt
                              ? `border-transparent ${CHIP_BG[accent]} ${CHIP_TEXT[accent]} font-semibold`
                              : "border-paper/15 text-paper hover:border-paper/40"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {current.field.type === "file" && (
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {((data[current.field.id] as string[]) ?? []).map(
                          (url) => (
                            <span
                              key={url}
                              className="flex items-center gap-2 rounded-full border border-paper/15 py-2 pr-2 pl-4 font-body text-sm text-paper"
                            >
                              {url.split("/").pop()?.slice(0, 24)}
                              <button
                                type="button"
                                onClick={() =>
                                  removeFile(current.field.id, url)
                                }
                                className="rounded-full bg-paper/10 px-2 py-0.5 text-xs hover:bg-paper/20"
                                aria-label="Quitar archivo"
                              >
                                ✕
                              </button>
                            </span>
                          ),
                        )}
                      </div>

                      {((data[current.field.id] as string[]) ?? []).length <
                        (current.field.maxFiles ?? 3) && (
                        <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-paper/25 px-4 py-2.5 font-body text-sm text-paper/70 hover:border-paper/50">
                          {uploading[current.field.id]
                            ? "Subiendo…"
                            : `Subir archivo (máx. ${current.field.maxFiles ?? 3})`}
                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            disabled={uploading[current.field.id]}
                            onChange={(e) =>
                              handleFileSelect(current.field, e.target.files)
                            }
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 font-body text-sm text-orange"
                    >
                      {error}
                    </motion.p>
                  )}
                </motion.section>
              )}

              {isReview && (
                <motion.section
                  key="review"
                  custom={direction}
                  variants={SLIDE_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="mb-8 flex items-start gap-3">
                    <span className="font-body pt-1 text-sm font-semibold text-blue">
                      ✓
                    </span>
                    <div>
                      <h1 className="font-display text-3xl leading-none tracking-wide text-paper md:text-4xl">
                        Revisión final
                      </h1>
                      <p className="mt-2 font-body text-sm text-paper/60">
                        Un vistazo antes de enviarlo al equipo.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {steps.map((s) => {
                      const rows = s.fields
                        .map((f) => {
                          const val = data[f.id];
                          const display = Array.isArray(val)
                            ? val.join(", ")
                            : val;
                          return display ? { label: f.label, display } : null;
                        })
                        .filter(Boolean) as {
                        label: string;
                        display: string;
                      }[];
                      if (rows.length === 0) return null;
                      return (
                        <div
                          key={s.id}
                          className="border-b border-paper/10 pb-5"
                        >
                          <h2 className="font-display mb-2 text-lg tracking-wide text-yellow">
                            {s.title}
                          </h2>
                          {rows.map((r) => (
                            <p
                              key={r.label}
                              className="font-body text-sm leading-relaxed text-paper/85"
                            >
                              <strong className="text-paper">{r.label}:</strong>{" "}
                              {r.display}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {status === "error" && (
                    <p className="mt-4 font-body text-sm text-orange">
                      {submitError}
                    </p>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {!isIntro && (
            <div className="mt-10 flex items-center justify-between border-t border-paper/10 pt-6">
              <button
                type="button"
                onClick={goBack}
                className="rounded-full border border-paper/15 px-5 py-2.5 font-body text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
              >
                Atrás
              </button>

              {!isReview ? (
                <div className="flex items-center gap-3">
                  <span className="hidden font-body text-xs text-paper/40 md:inline">
                    Enter ↵
                  </span>
                  <button
                    type="button"
                    onClick={goNext}
                    className={`rounded-full px-5 py-2.5 font-body text-sm font-semibold transition-transform hover:-translate-y-0.5 ${CHIP_BG[accent]} ${CHIP_TEXT[accent]}`}
                  >
                    Siguiente
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "submitting"}
                  className="rounded-full bg-yellow px-5 py-2.5 font-body text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {status === "submitting" ? "Enviando…" : "Enviar brief"}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* <footer className="flex shrink-0 flex-col items-center gap-3 border-t border-paper/10 px-6 py-5 sm:flex-row sm:justify-between">
        <span className="font-body text-xs text-paper/40">
          © {new Date().getFullYear()} Takariwa Studio — disturbio creativo
        </span>
        <nav className="flex items-center gap-4" aria-label="Redes sociales">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-paper/40 transition-colors hover:text-yellow [&_svg]:h-[1.05rem] [&_svg]:w-[1.05rem]"
            >
              <Icon />
            </a>
          ))}
        </nav>
      </footer> */}
    </div>
  );
}
