"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Users } from "lucide-react";

type Report = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  statusCode: string;
  location: string;
  supportCount: number;
};

const categories = [
  { value: "routes", label: "Routes et voirie" },
  { value: "eclairage", label: "Éclairage public" },
  { value: "espaces-verts", label: "Espaces verts" },
  { value: "proprete", label: "Propreté" },
  { value: "autre", label: "Autre" },
];

const statuses = [
  { value: "PENDING", label: "En attente" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "RESOLVED", label: "Résolu" },
  { value: "REJECTED", label: "Rejeté" },
];

const categoryLabels = Object.fromEntries(
  categories.map(({ value, label }) => [value, label])
);

function getStatusColor(statusCode: string) {
  switch (statusCode) {
    case "RESOLVED":
      return "bg-emerald-100 text-emerald-800";
    case "IN_PROGRESS":
      return "bg-amber-100 text-amber-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
}

export default function ReportsListClient() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [placeText, setPlaceText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      try {
        const response = await fetch("/api/reports", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Impossible de charger les signalements.");
        }

        const data: Report[] = await response.json();
        if (isMounted) {
          setReports(data);
          setError("");
        }
      } catch (loadError) {
        console.error("Erreur de chargement des signalements :", loadError);
        if (isMounted) {
          setError("Impossible de charger les signalements. Veuillez réessayer.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    const normalizedSearch = searchText.trim().toLocaleLowerCase("fr");
    const normalizedPlace = placeText.trim().toLocaleLowerCase("fr");

    return reports.filter((report) => {
      const matchesText =
        !normalizedSearch ||
        `${report.title} ${report.description}`
          .toLocaleLowerCase("fr")
          .includes(normalizedSearch);
      const matchesCategory =
        !selectedCategory || report.category === selectedCategory;
      const matchesStatus =
        !selectedStatus || report.statusCode === selectedStatus;
      const matchesPlace =
        !normalizedPlace ||
        report.location.toLocaleLowerCase("fr").includes(normalizedPlace);

      return matchesText && matchesCategory && matchesStatus && matchesPlace;
    });
  }, [placeText, reports, searchText, selectedCategory, selectedStatus]);

  function resetFilters() {
    setSearchText("");
    setSelectedCategory("");
    setSelectedStatus("");
    setPlaceText("");
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          Votre quartier
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Tous les signalements
        </h1>
        <p className="mt-3 text-slate-600">
          Retrouvez les problèmes signalés et suivez leur évolution.
        </p>
      </div>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div>
          <label
            htmlFor="report-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Rechercher
          </label>
          <input
            id="report-search"
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Titre ou description"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="report-category"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Catégorie
          </label>
          <select
            id="report-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="report-status"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Statut
          </label>
          <select
            id="report-status"
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Tous les statuts</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="report-place"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Lieu
          </label>
          <input
            id="report-place"
            type="search"
            value={placeText}
            onChange={(event) => setPlaceText(event.target.value)}
            placeholder="Nom du lieu ou de la rue"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </form>

      <p className="mb-5 text-sm text-slate-600" aria-live="polite">
        {loading
          ? "Chargement des signalements..."
          : `${filteredReports.length} signalement${filteredReports.length === 1 ? "" : "s"} trouvé${filteredReports.length === 1 ? "" : "s"}`}
      </p>

      {loading ? (
        <div
          className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500"
          role="status"
        >
          Chargement des signalements...
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border border-red-200 bg-white py-16 text-center text-red-700"
          role="alert"
        >
          {error}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-slate-800">
            Aucun signalement trouvé
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Essayez de modifier vos filtres ou réinitialisez-les.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/5"
            >
              <article>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {categoryLabels[report.category] ?? report.category}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(report.statusCode)}`}
                  >
                    {report.status}
                  </span>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-7 text-slate-900">
                  {report.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                  {report.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span className="flex min-w-0 items-center gap-2">
                    <MapPin size={16} className="shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={16} />
                    {report.supportCount}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
