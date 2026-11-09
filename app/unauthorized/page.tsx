import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-9 w-9 text-red-600" />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-slate-900">
          Accès refusé
        </h1>

        <p className="mb-6 text-slate-600">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>

        <Link
          href="/"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
