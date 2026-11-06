
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
} from "lucide-react";

type ApiReport = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
  createdAt: string;
};

type SavedReport = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  photoName: string | null;
  status: string;
  createdAt: string;
};

const categoryConfig: Record<
  string,
  {
    label: string;
    color: string;
    icon: typeof Route;
  }
> = {
  routes: {
    label: "Routes et voirie",
    color: "bg-amber-100 text-amber-800",
    icon: Route,
  },
  eclairage: {
    label: "Éclairage public",
    color: "bg-blue-100 text-blue-800",
    icon: Lightbulb,
  },
  "espaces-verts": {
    label: "Espaces verts",
    color: "bg-emerald-100 text-emerald-800",
    icon: Trees,
  },
  proprete: {
    label: "Propreté",
    color: "bg-purple-100 text-purple-800",
    icon: Recycle,
  },
  autre: {
    label: "Autre",
    color: "bg-slate-100 text-slate-800",
    icon: MapPin,
  },
};

const categories = [
  {
    icon: Route,
    name: "Routes et voirie",
    count: "Routes et voirie",
  },
  {
    icon: Lightbulb,
    name: "Éclairage public",
    count: "Éclairage public",
  },
  {
    icon: Trees,
    name: "Espaces verts",
    count: "Espaces verts",
  },
  {
    icon: Recycle,
    name: "Propreté",
    count: "Propreté",
  },
];

function mapCategory(category: string): string {
  switch (category) {
    case "ROADS":
    case "routes":
      return "routes";

    case "LIGHTING":
    case "eclairage":
      return "eclairage";

    case "GREEN_SPACES":
    case "espaces-verts":
      return "espaces-verts";

    case "CLEANLINESS":
    case "proprete":
      return "proprete";

    case "OTHER":
    case "autre":
      return "autre";

    default:
      return "autre";
  }
}

function mapStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "IN_PROGRESS":
      return "En cours";
    case "RESOLVED":
      return "Résolu";
    case "REJECTED":
      return "Rejeté";
    default:
      return status;
  }
}

function mapApiReport(report: ApiReport): SavedReport {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    category: mapCategory(report.category),
    location: report.address,
    coordinates: {
      lat: report.latitude,
      lng: report.longitude,
    },
    photoName: report.photoUrl,
    status: mapStatus(report.status),
    createdAt: report.createdAt,
  };
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "résolu":
      return "bg-emerald-100 text-emerald-800";

    case "en cours":
      return "bg-amber-100 text-amber-800";

    case "rejeté":
      return "bg-red-100 text-red-800";

    case "pris en charge":
      return "bg-purple-100 text-purple-800";

    default:
      return "bg-blue-100 text-blue-800";
  }
}

export default function Home() {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Catégorie actuellement sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      try {
        const response = await fetch("/api/reports", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Impossible de charger les signalements.");
        }

        const data: ApiReport[] = await response.json();

        if (isMounted) {
          setSavedReports(data.map(mapApiReport));
          setHasError(false);
        }
      } catch (error) {
        console.error("Erreur API :", error);

        if (isMounted) {
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  // Nombre de signalements résolus
  const resolvedReports = savedReports.filter(
    (report) => report.status === "Résolu"
  );

  // Tous les signalements triés par date
  const allRecentReports = [...savedReports].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  // Activités récentes du tableau de bord
  const recentActivities = allRecentReports.slice(0, 2);

  // Filtrage des signalements selon la catégorie sélectionnée
  const recentReports = allRecentReports
    .filter((report) =>
      selectedCategory === null
        ? true
        : report.category === selectedCategory
    )
    .slice(0, 6);

  // Calcul du nombre de signalements par catégorie
  const categoryCounts = savedReports.reduce(
    (counts, report) => {
      counts[report.category] =
        (counts[report.category] || 0) + 1;

      return counts;
    },
    {} as Record<string, number>
  );

  // Sélectionner une catégorie et aller à la liste
  function handleCategoryClick(categoryKey: string) {
    setSelectedCategory(categoryKey);

    setTimeout(() => {
      document
        .getElementById("signalements")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  // Afficher toutes les catégories
  function handleShowAll() {
    setSelectedCategory(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Section principale */}
      <section
        id="accueil"
        className="relative overflow-hidden bg-white"
      >
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
              <span className="block text-blue-600">
                votre impact.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Un problème dans votre quartier ? Signalez-le
              facilement, suivez son évolution et participez
              à la construction d’un environnement plus
              agréable pour tous.
            </p>

            <div
              id="signaler"
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/reports/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Faire un signalement
                <ArrowRight size={18} />
              </Link>

              <Link
                href="#signalements"
                onClick={handleShowAll}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                Voir les signalements
              </Link>
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
                    <p className="text-sm text-blue-700">
                      Signalements
                    </p>

                    <Route size={19} className="text-blue-600" />
                  </div>

                  <p className="mt-3 text-3xl font-bold text-blue-900">
                    {isLoaded ? savedReports.length : "—"}
                  </p>

                  <p className="mt-1 text-xs text-blue-700">
                    Total enregistré
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-emerald-700">
                      Résolus
                    </p>

                    <CheckCircle2
                      size={19}
                      className="text-emerald-600"
                    />
                  </div>

                  <p className="mt-3 text-3xl font-bold text-emerald-900">
                    {isLoaded ? resolvedReports.length : "—"}
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Signalements résolus
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">
                    Activité récente
                  </p>

                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    En direct
                  </span>
                </div>

                <div className="mt-5 space-y-5">
                  {!isLoaded ? (
                    <p className="text-sm text-slate-500">
                      Chargement...
                    </p>
                  ) : recentActivities.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Aucune activité pour le moment.
                    </p>
                  ) : (
                    recentActivities.map((report) => {
                      const config =
                        categoryConfig[report.category] ??
                        categoryConfig.autre;

                      const Icon = config.icon;

                      return (
                        <div
                          key={report.id}
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                            <Icon size={21} className="text-blue-700" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {report.title}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <MapPin size={13} />
                              <span className="truncate">
                                {report.location}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(report.status)}`}
                          >
                            {report.status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
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
              Choisissez une catégorie pour mieux identifier
              les problèmes de votre quartier.
            </p>
          </div>

          <a
            href="#signalements"
            onClick={handleShowAll}
            className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
          >
            Tous les signalements
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const categoryKey =
              Object.keys(categoryConfig).find(
                (key) =>
                  categoryConfig[key].label === category.name
              ) ?? "autre";

            return (
              <CategoryCard
                key={category.name}
                icon={category.icon}
                name={category.name}
                count={`${categoryCounts[categoryKey] ?? 0} signalement(s)`}
                onClick={() => handleCategoryClick(categoryKey)}
              />
            );
          })}
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
                Découvrez les problèmes signalés dans votre
                quartier et suivez leur état de traitement.
              </p>

              {selectedCategory !== null && (
                <p className="mt-3 text-sm font-medium text-blue-600">
                  Catégorie sélectionnée :{" "}
                  {categoryConfig[selectedCategory]?.label}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <Clock3 size={16} />
                {isLoaded
                  ? recentReports.length
                  : "—"}{" "}
                signalement(s)
              </span>

              {selectedCategory !== null && (
                <button
                  type="button"
                  onClick={handleShowAll}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {!isLoaded ? (
              <p className="col-span-full py-10 text-center text-slate-500">
                Chargement des signalements...
              </p>
            ) : hasError ? (
              <p className="col-span-full py-10 text-center text-red-600">
                Impossible de charger les signalements. Veuillez réessayer.
              </p>
            ) : recentReports.length > 0 ? (
              recentReports.map((report) => {
                const config =
                  categoryConfig[report.category] ??
                  categoryConfig.autre;

                return (
                  <ReportCard
                    key={report.id}
                    category={config.label}
                    title={report.title}
                    location={report.location}
                    status={report.status}
                    color={getStatusColor(report.status)}
                    icon={config.icon}
                  />
                );
              })
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <MapPin
                  size={35}
                  className="mx-auto text-blue-600"
                />

                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  Aucun signalement dans cette catégorie
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Aucun problème n&apos;a encore été signalé dans cette catégorie.
                </p>

                <button
                  type="button"
                  onClick={handleShowAll}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Voir tous les signalements
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
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
              Un petit geste peut contribuer à un grand
              changement. Participez à l’amélioration de
              votre communauté.
            </p>
          </div>

          <Link
            href="/reports/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Participer maintenant
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <a
            href="#accueil"
            className="font-bold text-slate-900"
          >
            Local<span className="text-blue-600">Impact</span>
          </a>

          <p>Ensemble pour des quartiers meilleurs.</p>

          <p>Projet académique · Version de démonstration</p>
        </div>
      </footer>
    </main>
  );
}
