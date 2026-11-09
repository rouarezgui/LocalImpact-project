import Link from "next/link";
import { Suspense } from "react";
import { Building2, ShieldCheck, MapPin } from "lucide-react";
import LoginForm from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

async function LoginContent({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registered = params.registered === "1";

  return (
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
          Bienvenue
        </p>
        <h2 className="text-3xl font-bold text-slate-900">
          Se connecter
        </h2>
        <p className="mt-2 text-slate-500">
          Accédez à votre compte LocalImpact.
        </p>
      </div>

      {registered && (
        <p className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
        </p>
      )}

      <LoginForm />

      <p className="mt-8 text-center text-xs text-slate-400">
        En vous connectant, vous accédez à votre espace personnel sécurisé.
      </p>
    </section>
  );
}

export default function LoginPage({ searchParams }: LoginPageProps) {
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
            <ShieldCheck className="mb-6 h-12 w-12 text-blue-200" />
            <h1 className="mb-5 text-4xl font-bold leading-tight">
              Heureux de vous retrouver !
            </h1>
            <p className="text-lg leading-relaxed text-blue-100">
              Connectez-vous à votre espace LocalImpact pour suivre vos
              signalements et contribuer à une communauté meilleure.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-blue-100">
            <MapPin size={17} />
            <span>Votre communauté, votre impact.</span>
          </div>
        </section>

        <Suspense
          fallback={
            <section className="p-10 text-center text-slate-500">
              Chargement du formulaire...
            </section>
          }
        >
          <LoginContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
