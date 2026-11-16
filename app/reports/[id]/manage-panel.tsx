"use client";

import { useEffect, useState } from "react";
import type { AuthUser } from "@/features/auth/domain/user";

type ReportManagementData = {
  id: string;
  statusCode?: string;
  assignedToId?: string | null;
};

type Manager = {
  id: string;
  name: string;
  role: "MANAGER";
};

interface ManagePanelProps {
  report: ReportManagementData;
  currentUser: AuthUser;
  onUpdated: () => Promise<void>;
}

export default function ManagePanel({
  report,
  currentUser,
  onUpdated,
}: ManagePanelProps) {
  const isAdmin = currentUser.role === "ADMIN";
  const isManager = currentUser.role === "MANAGER";
  const isAssignedManager =
    isManager && report.assignedToId === currentUser.id;
  const isClosed =
    report.statusCode === "RESOLVED" || report.statusCode === "REJECTED";

  const [managers, setManagers] = useState<Manager[]>([]);
  const [managersLoading, setManagersLoading] = useState(isAdmin);
  const [managersError, setManagersError] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState(
    report.assignedToId ?? ""
  );
  const [statusInput, setStatusInput] = useState(
    report.statusCode ?? "PENDING"
  );
  const [statusDescription, setStatusDescription] = useState("");
  const [assignmentBusy, setAssignmentBusy] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let cancelled = false;

    async function fetchManagers() {
      try {
        const response = await fetch("/api/managers", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Impossible de charger les responsables.");
        }

        if (!cancelled) {
          const managerList: Manager[] = data;
          setManagers(managerList);
        }
      } catch (error) {
        console.error("Erreur de chargement des responsables :", error);

        if (!cancelled) {
          setManagersError(
            error instanceof Error
              ? error.message
              : "Impossible de charger les responsables."
          );
        }
      } finally {
        if (!cancelled) {
          setManagersLoading(false);
        }
      }
    }

    void fetchManagers();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  async function handleAssignmentSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedManagerId) {
      setFeedback("Sélectionnez un responsable.");
      setFeedbackType("error");
      return;
    }

    setAssignmentBusy(true);
    setFeedback("");
    setFeedbackType("");

    try {
      const response = await fetch(`/api/reports/${report.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ managerId: selectedManagerId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible d’affecter le signalement.");
      }

      setFeedback("Le signalement a bien été affecté.");
      setFeedbackType("success");
      await onUpdated();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Impossible d’affecter le signalement."
      );
      setFeedbackType("error");
    } finally {
      setAssignmentBusy(false);
    }
  }

  async function handleStatusSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusBusy(true);
    setFeedback("");
    setFeedbackType("");

    try {
      const response = await fetch(`/api/reports/${report.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusInput,
          description: statusDescription || null,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Impossible de changer le statut.");
      }

      setFeedback("Le statut du signalement a été mis à jour.");
      setFeedbackType("success");
      setStatusDescription("");
      await onUpdated();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "Impossible de changer le statut."
      );
      setFeedbackType("error");
    } finally {
      setStatusBusy(false);
    }
  }

  if (currentUser.role === "USER") {
    return null;
  }

  if (!isAdmin && !isManager) {
    return null;
  }

  return (
    <div className="space-y-6">
      {isManager && !isAssignedManager && (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Seul le responsable affecté ou un administrateur peut changer le statut.
        </p>
      )}

      {isAdmin && (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Affecter à un responsable
          </h2>
          <form onSubmit={handleAssignmentSubmit} className="mt-4 space-y-4">
            <label
              htmlFor="manager"
              className="block text-sm font-medium text-slate-700"
            >
              Responsable
            </label>
            <select
              id="manager"
              value={selectedManagerId}
              onChange={(event) => setSelectedManagerId(event.target.value)}
              aria-busy={managersLoading}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            >
              <option value="">
                {managersLoading
                  ? "Chargement des responsables..."
                  : "Sélectionner un responsable"}
              </option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
            {managersError && (
              <p role="alert" className="text-sm text-red-600">
                {managersError}
              </p>
            )}
            {managers.length === 0 && !managersLoading && !managersError && (
              <p className="text-sm text-slate-500">
                Aucun responsable disponible.
              </p>
            )}
            <button
              type="submit"
              disabled={assignmentBusy}
              className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {assignmentBusy ? "Affectation en cours..." : "Affecter"}
            </button>
          </form>
        </article>
      )}

      {!isClosed && (isAdmin || isAssignedManager) && (
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Changer le statut
            </h2>
            <form onSubmit={handleStatusSubmit} className="mt-4 space-y-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-700"
              >
                Nouveau statut
              </label>
              <select
                id="status"
                value={statusInput}
                onChange={(event) => setStatusInput(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500"
              >
                <option value="PENDING">En attente</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="RESOLVED">Résolu</option>
                <option value="REJECTED">Rejeté</option>
              </select>

              <label
                htmlFor="statusDescription"
                className="block text-sm font-medium text-slate-700"
              >
                Description de l’intervention
              </label>
              <textarea
                id="statusDescription"
                value={statusDescription}
                onChange={(event) => setStatusDescription(event.target.value)}
                rows={4}
                required={statusInput === "RESOLVED"}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                placeholder="Décrivez l’action menée ou le motif du changement de statut..."
              />
              <button
                type="submit"
                disabled={statusBusy}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {statusBusy ? "Mise à jour en cours..." : "Enregistrer"}
              </button>
            </form>
        </article>
      )}

      {feedback && (
        <div
          role={feedbackType === "error" ? "alert" : "status"}
          className={`rounded-2xl border p-4 text-sm ${
            feedbackType === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
