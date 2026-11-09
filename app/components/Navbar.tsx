
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  LogOut,
  UserCircle,
  Users,
} from "lucide-react";

import type { AuthUser } from "@/features/auth/domain/user";
import { logoutAction } from "@/features/auth/presentation/actions/logout-action";

type NavbarProps = {
  user: AuthUser | null;
};

export default function Navbar({ user }: NavbarProps) {
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Building2 size={25} strokeWidth={1.8} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Local<span className="text-blue-600">Impact</span>
          </span>
        </Link>

        {/* Navigation selon le rôle */}
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">

          {/* Accessible à tous */}
          <Link href="/" className="transition hover:text-blue-600">
            Accueil
          </Link>

          {/* Accessible uniquement à l'ADMIN */}
          {isAdmin && (
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 transition hover:text-blue-600"
            >
              <Users size={17} />
              Gestion des utilisateurs
            </Link>
          )}
        </div>

        {/* Actions utilisateur */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {user ? (
            <>
              {/* Informations utilisateur */}
              <div className="hidden items-center gap-2 text-sm font-medium text-slate-700 sm:flex">
                <UserCircle size={20} className="text-blue-600" />

                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs font-semibold text-blue-600">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Déconnexion */}
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <LogOut size={16} />
                  <span>Déconnexion</span>
                </button>
              </form>

              {/* Création d'un signalement */}
              <Link
                href="/reports/new"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-4"
              >
                <span>Signaler un problème</span>
                <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <>
              {/* Connexion */}
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Connexion
              </Link>

              {/* Inscription */}
              <Link
                href="/register"
                className="hidden rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:inline-flex"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
