"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAdmin, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";

  return (
    <form
      action={formAction}
      className="w-full max-w-sm rounded-xl border border-border bg-card p-8"
    >
      <img src="/logo.svg" alt="Takariwa Studio" className="mb-6 h-9 w-auto" />
      <h1 className="font-display mb-1 text-2xl text-foreground">Admin</h1>
      <p className="font-body mb-6 text-sm text-muted-foreground">
        Ingresa para gestionar los briefs.
      </p>

      <input type="hidden" name="next" value={next} />

      <label
        htmlFor="user"
        className="font-body mb-1.5 block text-sm font-semibold text-foreground"
      >
        Usuario
      </label>
      <input
        id="user"
        name="user"
        type="text"
        required
        autoComplete="username"
        autoFocus
        className="font-body mb-4 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-foreground focus:border-primary focus:outline-none"
      />

      <label
        htmlFor="password"
        className="font-body mb-1.5 block text-sm font-semibold text-foreground"
      >
        Contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="font-body mb-6 w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-foreground focus:border-primary focus:outline-none"
      />

      {state.error && (
        <p className="font-body mb-4 text-sm text-destructive">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="font-body w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
