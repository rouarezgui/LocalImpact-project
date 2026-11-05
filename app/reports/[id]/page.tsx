
"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  MapPinned,
  Tag,
  Clock3,
  FileText,
} from "lucide-react";

type Report = {
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

const STORAGE_KEY = "localimpact-reports";

// Écouter les changements du localStorage
function subscribeToReports(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

// Lire les signalements
function getReportsSnapshot() {
  return localStorage.getItem(STORAGE_KEY);
}

// Valeur utilisée pendant le rendu serveur
function getServerReportsSnapshot() {
  return "__SERVER__";
}

// Correspondance des catégories
const categoryLabels: Record<string, string> = {
  routes: "Routes et voirie",
  eclairage: "Éclairage public",
  "espaces-verts": "Espaces verts",
  proprete: "Propreté",
  autre: "Autre",
};

// Style des statuts
function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "résolu":
    case "resolu":
      return "bg-emerald-100 text-emerald-800";

    case "en cours":
      return "bg-amber-100 text-amber-800";

    case "pris en charge":
      return "bg-purple-100 text-purple-800";

    default:
      return "bg-blue-100 text-blue-800";
  }
}

export default function ReportDetailsPage() {
  const params = useParams<{ id: string }>();

  const storedReports = useSyncExternalStore(
    subscribeToReports,
    getReportsSnapshot,
    getServerReportsSnapshot
  );

  // Chargement initial
  if (storedReports === "__SERVER__") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Chargement du signalement...
        </p>
      </main>
    );
  }

  // Recherche du signalement
  let report: Report | null = null;

  try {
    if (storedReports) {
      const reports: Report[] = JSON.parse(storedReports);

      report =
        reports.find((item) => item.id === params.id) ?? null;
    }
  } catch (error) {
    console.error("Erreur de lecture des signalements :", error);
  }

  // Signalement introuvable
  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <MapPin
            size={40}
            className="mx-auto text-slate-400"
          />

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Signalement introuvable
          </h1>

          <p className="mt-3 text-slate-500">
            Ce signalement n&apos;existe pas ou n&apos;est plus disponible.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  // Informations du signalement
  const category =
    categoryLabels[report.category] ?? report.category ?? "Autre";

  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Date non disponible";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-slate-900"
          >
            Local<span className="text-blue-600">Impact</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Retour
          </Link>
        </nav>
      </header>

      {/* Contenu principal */}
      <section className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          Détails du signalement
        </p>

        {/* Titre et statut */}
        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-slate-900">
              {report.title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={17} />
              Créé le {formattedDate}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(report.status)}`}
          >
            {report.status}
          </span>
        </div>

        {/* Grille d'informations */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText
                  size={20}
                  className="text-blue-600"
                />
                Description du problème
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-600">
                {report.description}
              </p>
            </article>

            {/* Localisation */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <MapPinned
                  size={20}
                  className="text-blue-600"
                />
                Localisation
              </h2>

              <div className="mt-5 flex items-start gap-3">
                <MapPin
                  size={20}
                  className="mt-1 shrink-0 text-blue-600"
                />

                <div>
                  <p className="font-semibold text-slate-800">
                    Adresse du signalement
                  </p>

                  <p className="mt-1 leading-7 text-slate-600">
                    {report.location || "Adresse non disponible"}
                  </p>
                </div>
              </div>

              {report.coordinates && (
                <>
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Coordonnées GPS
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      Latitude :{" "}
                      {report.coordinates.lat.toFixed(6)}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Longitude :{" "}
                      {report.coordinates.lng.toFixed(6)}
                    </p>
                  </div>

                  <a
                    href={`https://www.openstreetmap.org/?mlat=${report.coordinates.lat}&mlon=${report.coordinates.lng}#map=17/${report.coordinates.lat}/${report.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
                  >
                    Voir sur OpenStreetMap
                    <MapPin size={17} />
                  </a>
                </>
              )}
            </article>
          </div>

          {/* Colonne latérale */}
          <aside className="space-y-6">
            {/* Informations */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Informations
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Tag size={16} />
                    Catégorie
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {category}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={16} />
                    Statut actuel
                  </p>

                  <p className="mt-2 font-semibold text-slate-800">
                    {report.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Identifiant
                  </p>

                  <p className="mt-2 break-all text-xs text-slate-600">
                    {report.id}
                  </p>
                </div>
              </div>
            </article>

            {/* Message communautaire */}
            <article className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="font-bold text-blue-900">
                Merci pour votre participation !
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                Votre signalement contribue à améliorer
                votre quartier et votre cadre de vie.
              </p>
            </article>

            {/* Photo */}
            {report.photoName && (
              <article className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">
                  Photo sélectionnée
                </h2>

                <p className="mt-2 break-all text-sm text-slate-500">
                  {report.photoName}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Le fichier image n&apos;est pas encore sauvegardé.
                </p>
              </article>
            )}
          </aside>
        </div>

        {/* Bouton retour */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Retour aux signalements
          </Link>
        </div>
      </section>
    </main>
  );
}
