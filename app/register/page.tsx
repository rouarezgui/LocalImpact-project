import Link from "next/link";
import { Building2, MapPin, Heart } from "lucide-react";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-blue-700 p-10 text-white md:flex">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Building2 size={26} />
            </span>
            <span className="text-2xl font-bold">
              Local<span className="text-blue-200">Impact</span>
            </span>
          </Link>

          <div>
            <MapPin className="mb-6 h-12 w-12 text-blue-200" />
            <h1 className="mb-5 text-4xl font-bold leading-tight">
              Ensemble, améliorons notre communauté.
            </h1>
            <p className="text-lg leading-relaxed text-blue-100">
              Rejoignez LocalImpact et participez à l'amélioration de votre
              environnement en signalant les problèmes et en suivant leur résolution.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-100">
            <Heart size={17} />
            <span>Chaque signalement compte.</span>
          </div>
        </section>

        <section className="p-7 sm:p-10">
          <div className="mb-8 md:hidden">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Building2 size={25} />
              </span>
              <span className="text-xl font-bold">
                Local<span className="text-blue-600">Impact</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Rejoignez-nous
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-slate-500">
              Remplissez les informations ci-dessous pour commencer.
            </p>
          </div>

          <RegisterForm />
        </section>
      </div>
    </main>
  );
}
