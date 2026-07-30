"use client";

import { useState } from "react";
import { STEPS, emptyFormData, type BriefFormData } from "./steps";
import { submitBrief } from "./actions";

// Mismos 5 colores que ya rotan en el marquee de la home — un acento distinto
// por paso, no decoración nueva.
const ACCENTS = ["yellow", "orange", "magenta", "purple", "blue"] as const;
type Accent = (typeof ACCENTS)[number];

function accentOf(index: number): Accent {
  return ACCENTS[index % ACCENTS.length];
}

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

export default function BriefForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<BriefFormData>(emptyFormData());
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isReview = stepIndex === STEPS.length;
  const step = STEPS[stepIndex];
  const accent = accentOf(stepIndex);

  function setField(id: string, value: string | string[]) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  function toggleCheckbox(id: string, option: string) {
    const current = (data[id] as string[]) ?? [];
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    setField(id, next);
  }

  async function handleSubmit() {
    setStatus("submitting");
    setError(null);
    const result = await submitBrief(data);
    if (result.ok) {
      setStatus("done");
    } else {
      setStatus("error");
      setError(result.error ?? "Algo salió mal.");
    }
  }

  if (status === "done") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <span className="font-body text-[0.7rem] tracking-[0.24em] text-yellow uppercase md:text-xs md:tracking-[0.28em]">
          Brief recibido
        </span>
        <h1 className="headline font-display mt-3 text-[2.75rem] leading-[0.92] text-paper sm:text-[4rem]">
          <span data-text="Listo.">Listo.</span>
        </h1>
        <p className="mt-4 max-w-md font-body text-[0.95rem] leading-relaxed text-paper/80">
          Gracias por tomarte el tiempo. El equipo de Takariwa revisa esto y te
          escribe a <strong className="text-paper">{String(data.email)}</strong>{" "}
          con los próximos pasos.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 py-10 md:py-14">
      <header className="mb-10 flex items-center justify-between">
        <img src="/logo.svg" alt="Takariwa Studio" className="h-6 w-auto md:h-7" />
        <span className="font-body text-[0.65rem] tracking-[0.2em] text-paper/50 uppercase">
          Brief de proyecto web
        </span>
      </header>

      {/* Progreso: puntos de color, mismo lenguaje visual que el marquee de la home */}
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <span
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= stepIndex ? CHIP_BG[accentOf(i)] : "bg-paper/10"
            } ${isReview ? CHIP_BG[accentOf(i)] : ""}`}
          />
        ))}
      </div>

      {!isReview ? (
        <section key={step.id} className="flex-1">
          <div className="mb-8 flex items-start gap-3">
            <span className={`font-body pt-1 text-sm font-semibold ${TEXT_ACCENT[accent]}`}>
              {step.number}
            </span>
            <div>
              <h1 className="font-display text-3xl leading-none tracking-wide text-paper md:text-4xl">
                {step.title}
              </h1>
              {step.description && (
                <p className="mt-2 font-body text-sm text-paper/60">{step.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-7">
            {step.fields.map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="mb-2 block font-body text-sm font-semibold text-paper">
                  {f.label}
                  {f.hint && <span className="font-normal text-paper/50 italic"> — {f.hint}</span>}
                </label>

                {f.type === "textarea" && (
                  <textarea
                    id={f.id}
                    rows={3}
                    value={(data[f.id] as string) ?? ""}
                    onChange={(e) => setField(f.id, e.target.value)}
                    className="w-full resize-y border-b border-paper/15 bg-transparent py-2 font-body text-paper placeholder:text-paper/30 focus:border-paper/60 focus:outline-none"
                  />
                )}

                {(f.type === "text" || f.type === "email" || f.type === "tel" || f.type === "date") && (
                  <input
                    id={f.id}
                    type={f.type}
                    value={(data[f.id] as string) ?? ""}
                    onChange={(e) => setField(f.id, e.target.value)}
                    className="w-full border-b border-paper/15 bg-transparent py-2 font-body text-paper placeholder:text-paper/30 focus:border-paper/60 focus:outline-none"
                  />
                )}

                {f.type === "checkbox-group" && (
                  <div className="flex flex-wrap gap-2">
                    {f.options?.map((opt) => {
                      const checked = ((data[f.id] as string[]) ?? []).includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          aria-pressed={checked}
                          onClick={() => toggleCheckbox(f.id, opt)}
                          className={`rounded-full border px-4 py-2 font-body text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper focus-visible:outline-offset-2 ${
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

                {f.type === "radio-group" && (
                  <div className="flex flex-wrap gap-2">
                    {f.options?.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        aria-pressed={data[f.id] === opt}
                        onClick={() => setField(f.id, opt)}
                        className={`rounded-full border px-4 py-2 font-body text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-paper focus-visible:outline-offset-2 ${
                          data[f.id] === opt
                            ? `border-transparent ${CHIP_BG[accent]} ${CHIP_TEXT[accent]} font-semibold`
                            : "border-paper/15 text-paper hover:border-paper/40"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex-1">
          <div className="mb-8 flex items-start gap-3">
            <span className="font-body pt-1 text-sm font-semibold text-blue">✓</span>
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
            {STEPS.map((s) => {
              const rows = s.fields
                .map((f) => {
                  const val = data[f.id];
                  const display = Array.isArray(val) ? val.join(", ") : val;
                  return display ? { label: f.label, display } : null;
                })
                .filter(Boolean) as { label: string; display: string }[];
              if (rows.length === 0) return null;
              return (
                <div key={s.id} className="border-b border-paper/10 pb-5">
                  <h2 className="font-display mb-2 text-lg tracking-wide text-yellow">{s.title}</h2>
                  {rows.map((r) => (
                    <p key={r.label} className="font-body text-sm leading-relaxed text-paper/85">
                      <strong className="text-paper">{r.label}:</strong> {r.display}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>

          {status === "error" && (
            <p className="mt-4 font-body text-sm text-orange">{error}</p>
          )}
        </section>
      )}

      <footer className="mt-10 flex items-center justify-between border-t border-paper/10 pt-6">
        <button
          type="button"
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          disabled={stepIndex === 0}
          className="rounded-full border border-paper/15 px-5 py-2.5 font-body text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0"
        >
          Atrás
        </button>

        {!isReview ? (
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.min(STEPS.length, i + 1))}
            className={`rounded-full px-5 py-2.5 font-body text-sm font-semibold transition-transform hover:-translate-y-0.5 ${CHIP_BG[accent]} ${CHIP_TEXT[accent]}`}
          >
            Siguiente
          </button>
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
      </footer>
    </div>
  );
}
