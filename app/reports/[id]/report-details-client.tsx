
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { AuthUser } from "@/features/auth/domain/user";
import ManagePanel from "./manage-panel";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  MapPinned,
  Tag,
  UserRound,
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
  statusCode?: string;
  supportCount?: number;
  assignedToId?: string | null;
  assignedToName?: string | null;
  createdAt: string;
};

type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
};

type HistoryEntry = {
  id: string;
  oldStatus: string | null;
  newStatus: string;
  description: string | null;
  createdAt: string;
  authorName: string;
};

const categoryLabels: Record<string, string> = {
  routes: "Routes et voirie",
  eclairage: "Éclairage public",
  "espaces-verts": "Espaces verts",
  proprete: "Propreté",
  autre: "Autre",
};

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "résolu":
    case "resolu":
      return "bg-emerald-100 text-emerald-800";

    case "en cours":
      return "bg-amber-100 text-amber-800";

    case "rejeté":
    case "rejete":
      return "bg-red-100 text-red-800";

    case "pris en charge":
      return "bg-purple-100 text-purple-800";

    default:
      return "bg-blue-100 text-blue-800";
  }
}

interface ReportDetailsClientProps {
  currentUser: AuthUser;
}

export default function ReportDetailsPage({
  currentUser,
}: ReportDetailsClientProps) {
  const params = useParams<{ id: string }>();
  const reportId = params.id;

  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");
  const [supportBusy, setSupportBusy] = useState(false);
  const [commentBusy, setCommentBusy] = useState(false);

  const refreshReport = useCallback(async () => {
    const response = await fetch("/api/reports", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Impossible de récupérer les signalements.");
    }

    const reports: Report[] = await response.json();
    setReport(reports.find((item) => item.id === reportId) ?? null);
  }, [reportId]);

  const refreshComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}/comments`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer les commentaires.");
      }

      const data: CommentItem[] = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Erreur de chargement des commentaires :", err);
      throw err;
    }
  }, [reportId]);

  const refreshHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}/history`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de récupérer l’historique.");
      }

      const data: HistoryEntry[] = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Erreur de chargement de l’historique :", err);
      throw err;
    }
  }, [reportId]);

  const refreshManagementData = useCallback(async () => {
    await Promise.all([refreshReport(), refreshHistory()]);
  }, [refreshHistory, refreshReport]);

  useEffect(() => {
    if (!reportId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const reportResponse = await fetch("/api/reports", {
          cache: "no-store",
        });

        if (!reportResponse.ok) {
          throw new Error("Impossible de récupérer les signalements.");
        }

        const reports: Report[] = await reportResponse.json();
        const foundReport = reports.find((item) => item.id === reportId) ?? null;

        if (!cancelled) {
          setReport(foundReport);
        }
      } catch (err) {
        console.error("Erreur de chargement du signalement :", err);
        if (!cancelled) {
          setError("Impossible de charger les détails du signalement.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }

      try {
        const commentsResponse = await fetch(
          `/api/reports/${reportId}/comments`,
          { cache: "no-store" }
        );

        if (!commentsResponse.ok) {
          throw new Error("Impossible de récupérer les commentaires.");
        }

        const commentsData: CommentItem[] = await commentsResponse.json();
        if (!cancelled) {
          setComments(commentsData);
        }
      } catch (err) {
        console.error("Erreur de chargement des commentaires :", err);
        if (!cancelled) {
          setComments([]);
        }
      }

      try {
        const historyResponse = await fetch(
          `/api/reports/${reportId}/history`,
          { cache: "no-store" }
        );

        if (!historyResponse.ok) {
          throw new Error("Impossible de récupérer l’historique.");
        }

        const historyData: HistoryEntry[] = await historyResponse.json();
        if (!cancelled) {
          setHistory(historyData);
        }
      } catch (err) {
        console.error("Erreur de chargement de l’historique :", err);
        if (!cancelled) {
          setHistory([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reportId]);

  async function handleSupport() {
    if (!reportId) return;

    setFeedback("");
    setFeedbackType("");
    setSupportBusy(true);

    try {
      const response = await fetch(`/api/reports/${reportId}/support`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de soutenir ce signalement.");
      }

      setReport((current) =>
        current ? { ...current, supportCount: data.supportCount } : current
      );
      setFeedback("Votre soutien a bien été enregistré.");
      setFeedbackType("success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de soutenir ce signalement.";
      setFeedback(message);
      setFeedbackType("error");
    } finally {
      setSupportBusy(false);
    }
  }

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!commentInput.trim()) {
      setFeedback("Le commentaire ne peut pas être vide.");
      setFeedbackType("error");
      return;
    }

    setCommentBusy(true);
    try {
      const response = await fetch(`/api/reports/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de publier le commentaire.");
      }

      setCommentInput("");
      setFeedback("Commentaire ajouté avec succès.");
      setFeedbackType("success");
      await refreshComments();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de publier le commentaire.";
      setFeedback(message);
      setFeedbackType("error");
    } finally {
      setCommentBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Chargement du signalement...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error}</p>

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

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <MapPin size={40} className="mx-auto text-slate-400" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Signalement introuvable</h1>
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

  const category = categoryLabels[report.category] ?? report.category ?? "Autre";
  const isClosed =
    report.statusCode === "RESOLVED" || report.statusCode === "REJECTED";
  const formattedDate = report.createdAt
    ? new Date(report.createdAt).toLocaleString("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Date non disponible";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Local<span className="text-blue-600">Impact</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600">
            <ArrowLeft size={17} />
            Retour
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Détails du signalement</p>
        {isClosed && (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Ce signalement est clos.
          </p>
        )}

        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-slate-900">{report.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={17} />
              Créé le {formattedDate}
            </p>
          </div>

          <span className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(report.status)}`}>
            {report.status}
          </span>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <FileText size={20} className="text-blue-600" />
                Description du problème
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-600">{report.description}</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <MapPinned size={20} className="text-blue-600" />
                Localisation
              </h2>

              <div className="mt-5 flex items-start gap-3">
                <MapPin size={20} className="mt-1 shrink-0 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-800">Adresse du signalement</p>
                  <p className="mt-1 leading-7 text-slate-600">{report.location || "Adresse non disponible"}</p>
                </div>
              </div>

              {report.coordinates && (
                <>
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">Coordonnées GPS</p>
                    <p className="mt-2 text-sm text-slate-600">Latitude : {report.coordinates.lat.toFixed(6)}</p>
                    <p className="mt-1 text-sm text-slate-600">Longitude : {report.coordinates.lng.toFixed(6)}</p>
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

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">Soutien communautaire</h2>
                <button
                  type="button"
                  onClick={handleSupport}
                  disabled={supportBusy}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {supportBusy ? "Envoi en cours..." : "Soutenir"}
                </button>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Nombre de soutiens : <strong>{report.supportCount ?? 0}</strong>
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Commentaires</h2>

              <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
                <label htmlFor="comment" className="text-sm font-medium text-slate-700">
                  Votre commentaire
                </label>
                <textarea
                  id="comment"
                  value={commentInput}
                  onChange={(event) => setCommentInput(event.target.value)}
                  rows={4}
                  maxLength={500}
                  aria-label="Ajouter un commentaire"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                  placeholder="Partagez votre avis ou un détail utile..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{commentInput.length}/500</span>
                  <button
                    type="submit"
                    disabled={commentBusy}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {commentBusy ? "Publication..." : "Publier"}
                  </button>
                </div>
              </form>

              {comments.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">Aucun commentaire pour le moment.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800">{comment.authorName}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Historique</h2>

              {history.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">Aucun historique enregistré.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800">{entry.authorName}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(entry.createdAt).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {entry.oldStatus ?? "Début"} → {entry.newStatus}
                      </p>
                      {entry.description && (
                        <p className="mt-2 text-sm text-slate-500">{entry.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <aside className="space-y-6">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Informations</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Tag size={16} />
                    Catégorie
                  </p>
                  <p className="mt-2 font-semibold text-slate-800">{category}</p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={16} />
                    Statut actuel
                  </p>
                  <p className="mt-2 font-semibold text-slate-800">{report.status}</p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <UserRound size={16} />
                    Responsable
                  </p>
                  <p className="mt-2 font-semibold text-slate-800">
                    {report.assignedToName ?? "Aucun responsable"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Identifiant</p>
                  <p className="mt-2 break-all text-xs text-slate-600">{report.id}</p>
                </div>
              </div>
            </article>

            <ManagePanel
              report={report}
              currentUser={currentUser}
              onUpdated={refreshManagementData}
            />

            {feedback && (
              <div
                role="status"
                className={`rounded-2xl border p-4 text-sm ${
                  feedbackType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {feedback}
              </div>
            )}
          </aside>
        </div>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600">
            <ArrowLeft size={17} />
            Retour aux signalements
          </Link>
        </div>
      </section>
    </main>
  );
}
