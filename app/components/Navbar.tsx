
import { ArrowRight, Building2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <a href="#accueil" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Building2 size={25} strokeWidth={1.8} />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Local<span className="text-blue-600">Impact</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#accueil" className="transition hover:text-blue-600">
            Accueil
          </a>

          <a href="#signalements" className="transition hover:text-blue-600">
            Signalements
          </a>

          <a href="#categories" className="transition hover:text-blue-600">
            Catégories
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="#connexion"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            Connexion
          </a>

          <a
            href="/reports/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-4"
          >
            <span>Signaler un problème</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </nav>
    </header>
  );
}
