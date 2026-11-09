"use client";

import { useActionState } from "react";
import Link from "next/link";
import { UserPlus, LoaderCircle } from "lucide-react";

import { registerAction } from "@/features/auth/presentation/actions/register-action";
import type { AuthActionState } from "@/features/auth/presentation/actions/auth-action-state";

const initialState: AuthActionState = {
  success: false,
};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
          Nom complet
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          placeholder="Votre nom complet"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        {state.errors?.name?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={255}
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
          minLength={8}
          autoComplete="new-password"
          placeholder="Au moins 8 caractères"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        {state.errors?.password?.[0] && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password[0]}</p>
        )}
        <p className="mt-2 text-xs text-slate-500">
          Utilisez une majuscule, une minuscule et un chiffre.
        </p>
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
            Création du compte...
          </>
        ) : (
          <>
            <UserPlus className="h-5 w-5" />
            Créer mon compte
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
