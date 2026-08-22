"use client";

import { useActionState } from "react";
import { signInAction, signUpAction } from "@/app/actions/auth";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const action = mode === "sign-in" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {mode === "sign-up" ? (
        <label className="block text-sm font-medium">
          Full name
          <input name="fullName" className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" autoComplete="name" />
        </label>
      ) : null}
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" autoComplete="email" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" required minLength={6} className="focus-ring mt-1 min-h-11 w-full rounded border border-ink/15 px-3" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} />
      </label>
      {state?.error ? <p className="rounded border border-clay/30 bg-clay/10 p-3 text-sm text-clay">{state.error}</p> : null}
      <button disabled={pending} className="focus-ring w-full rounded bg-leaf px-4 py-3 font-semibold text-white disabled:opacity-60">
        {pending ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
