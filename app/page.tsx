import Navbar from "./components/Navbar";
import CategoryCard from "./components/CategoryCard";
import ReportCard from "./components/ReportCard";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  Lightbulb,
  MapPin,
  Recycle,
  Route,
  Trees,
  Users,
} from "lucide-react";

const categories = [
  {
    icon: Route,
    name: "Routes et voirie",
    count: "12 signalements",
  },
  {
    icon: Lightbulb,
    name: "Éclairage public",
    count: "8 signalements",
  },
  {
    icon: Trees,
    name: "Espaces verts",
    count: "6 signalements",
  },
  {
    icon: Recycle,
    name: "Propreté",
    count: "9 signalements",
  },
];

const reports = [
  {
    category: "Routes et voirie",
    title: "Nid-de-poule sur la route principale",
    location: "Centre-ville",
    status: "En cours",
    color: "bg-amber-100 text-amber-800",
    icon: Route,
  },
  {
    category: "Éclairage public",
    title: "Lampadaire en panne",
    location: "Quartier résidentiel",
    status: "Nouveau",
    color: "bg-blue-100 text-blue-800",
    icon: Lightbulb,
  },
  {
    category: "Propreté",
    title: "Déchets près du parc municipal",
    location: "Parc municipal",
    status: "Résolu",
    color: "bg-emerald-100 text-emerald-800",
    icon: Recycle,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Section principale */}
      <section id="accueil" className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Ensemble, améliorons notre ville
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Votre quartier,
              <span className="block text-blue-600">votre impact.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Un problème dans votre quartier ? Signalez-le facilement,
              suivez son évolution et participez à la construction d’un
              environnement plus agréable pour tous.
            </p>

            <div id="signaler" className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/reports/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Faire un signalement
                <ArrowRight size={18} />
              </a>

              <a
                href="#signalements"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                Voir les signalements
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Simple et accessible
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Suivi des signalements
              </span>

              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Action collective
              </span>
            </div>
          </div>

          {/* Aperçu du tableau de bord */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-900/10 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Vue d’ensemble
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    La vie du quartier
                  </h2>
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Building2 size={27} className="text-blue-600" />
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-blue-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-blue-700">Signalements</p>
                    <Route size={19} className="text-blue-600" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-blue-900">35</p>
                  <p className="mt-1 text-xs text-blue-700">
                    Données de démonstration
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-emerald-700">Résolus</p>
                    <CheckCircle2 size={19} className="text-emerald-600" />
                  </div>
                  <p className="mt-3 text-3xl font-bold text-emerald-900">
                    18
                  </p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Données de démonstration
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">Activité récente</p>
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    Démonstration
                  </span>
                </div>

                <div className="mt-5 space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                      <Route size={21} className="text-amber-700" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        Réparation d’une route
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={13} />
                        Centre-ville
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                      En cours
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                      <Lightbulb size={21} className="text-emerald-700" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        Éclairage rétabli
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={13} />
                        Quartier résidentiel
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      Résolu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:block">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Users size={18} className="text-blue-600" />
                Chaque signalement compte
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Une communauté plus engagée
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section
        id="categories"
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Agir ensemble
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Que souhaitez-vous signaler ?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Choisissez une catégorie pour mieux identifier les problèmes
              de votre quartier.
            </p>
          </div>

          <a
            href="#signalements"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
          >
            Tous les signalements
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              icon={category.icon}
              name={category.name}
              count={category.count}
            />
          ))}
        </div>
      </section>

      
      {/* Signalements récents */}
      <section
        id="signalements"
        className="border-y border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Transparence et suivi
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Signalements récents
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Découvrez des exemples de problèmes et de leur état de
                traitement.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Clock3 size={16} />
              Données de démonstration
            </span>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {reports.map((report) => (
              <ReportCard
                key={report.title}
                category={report.category}
                title={report.title}
                location={report.location}
                status={report.status}
                color={report.color}
                icon={report.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Appel à l'action */}
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-blue-700 px-7 py-10 text-white sm:px-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Votre ville mérite le meilleur.
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-blue-100">
              Un petit geste peut contribuer à un grand changement.
              Participez à l’amélioration de votre communauté.
            </p>
          </div>

          <a
            href="/reports/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Participer maintenant
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a href="#accueil" className="font-bold text-slate-900">
            Local<span className="text-blue-600">Impact</span>
          </a>

          <p>Ensemble pour des quartiers meilleurs.</p>
          <p>Projet académique · Version de démonstration</p>
        </div>
      </footer>
    </main>
  );
}
