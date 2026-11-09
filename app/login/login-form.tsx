"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LogIn, LoaderCircle } from "lucide-react";

import { loginAction } from "@/features/auth/presentation/actions/login-action";
import type { AuthActionState } from "@/features/auth/presentation/actions/auth-action-state";

const initialState: AuthActionState = {
  success: false,
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="exemple@email.com"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        {state.errors?.email?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Votre mot de passe"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        {state.errors?.password?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
        )}
      </div>

      {state.message && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Connexion...
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            Se connecter
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Vous n'avez pas encore de compte ?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
