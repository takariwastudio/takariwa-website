"use client";

import { useState, type FormEvent } from "react";
import { submitContact } from "../actions";

type Status = "idle" | "submitting" | "done" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      nombre: formData.get("nombre")?.toString() ?? "",
      telefono: formData.get("telefono")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      mensaje: formData.get("mensaje")?.toString() ?? "",
      aceptaPolitica: formData.get("aceptaPolitica") === "on",
    };

    setStatus("submitting");
    setErrorMessage("");

    const result = await submitContact(payload);

    if (result.ok) {
      setStatus("done");
      form.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Algo salió mal.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-start gap-2 bg-paper px-4 py-8 md:w-[555px]"
      noValidate
    >
      <h2 className="font-display text-[2.25rem] leading-[0.8] tracking-[-0.03em] text-ink uppercase sm:text-[2.5rem]">
        Sin miedo cuéntanos ¿qué necesita tu marca?
      </h2>

      <label
        htmlFor="nombre"
        className="mt-2 font-body text-[10px] text-ink uppercase"
      >
        Nombre
      </label>
      <input
        id="nombre"
        name="nombre"
        type="text"
        required
        disabled={status === "submitting"}
        className="h-[21px] w-full border border-ink bg-paper px-2 font-body text-[10px] text-ink outline-none focus:border-2"
      />

      <label
        htmlFor="telefono"
        className="mt-2 font-body text-[10px] text-ink uppercase"
      >
        Teléfono
      </label>
      <input
        id="telefono"
        name="telefono"
        type="tel"
        required
        disabled={status === "submitting"}
        className="h-[21px] w-full border border-ink bg-paper px-2 font-body text-[10px] text-ink outline-none focus:border-2"
      />

      <label
        htmlFor="email"
        className="mt-2 font-body text-[10px] text-ink uppercase"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        disabled={status === "submitting"}
        className="h-[21px] w-full border border-ink bg-paper px-2 font-body text-[10px] text-ink outline-none focus:border-2"
      />

      <label
        htmlFor="mensaje"
        className="mt-2 font-body text-[10px] text-ink uppercase"
      >
        Mensaje
      </label>
      <textarea
        id="mensaje"
        name="mensaje"
        required
        rows={4}
        disabled={status === "submitting"}
        className="h-[63px] w-full resize-none border border-ink bg-paper px-2 py-1 font-body text-[10px] text-ink outline-none focus:border-2"
      />

      <p className="mt-2 font-body text-[10px] text-ink uppercase">
        *Normalmente respondemos en 1 o 2 días hábiles
      </p>

      <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-1.5">
          <input
            type="checkbox"
            name="aceptaPolitica"
            required
            disabled={status === "submitting"}
            className="h-3 w-3 shrink-0 border border-ink accent-ink"
          />
          <span className="font-body text-[10px] text-ink uppercase">
            Acepto la política de privacidad y el aviso legal
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex shrink-0 items-center gap-1.5 bg-ink px-3 py-1.5 font-body text-[10px] text-paper uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Enviando…" : "Enviar"}
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div aria-live="polite" className="min-h-[1.5em] w-full">
        {status === "done" && (
          <p className="mt-1 font-body text-[10px] text-orange uppercase">
            ¡Gracias! Ya recibimos tu mensaje, te contactamos pronto.
          </p>
        )}
        {status === "error" && (
          <p className="mt-1 font-body text-[10px] text-magenta uppercase">
            {errorMessage}
          </p>
        )}
      </div>

      <p className="mt-2 font-body text-[8px] leading-snug text-ink uppercase">
        Al enviar este formulario confirmas que la información es verídica y
        aceptas que nos pongamos en contacto contigo.
        <br />
        <br />
        Para acceder, rectificar o eliminar tu información escríbenos a:
        <br />
        hola@takariwa.studio
      </p>
    </form>
  );
}
