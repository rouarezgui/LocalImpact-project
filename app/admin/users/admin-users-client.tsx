
"use client";

import { useState } from "react";
import type { AuthUser, UserRole } from "@/features/auth/domain/user";

interface AdminUsersClientProps {
  initialUsers: AuthUser[];
}

const roles: UserRole[] = ["USER", "MANAGER", "ADMIN"];

export default function AdminUsersClient({
  initialUsers,
}: AdminUsersClientProps) {
  const [users, setUsers] = useState<AuthUser[]>(initialUsers);

  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, UserRole>
  >(
    Object.fromEntries(
      initialUsers.map((user) => [user.id, user.role])
    )
  );

  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  async function handleRoleChange(userId: string) {
    const newRole = selectedRoles[userId];

    setSavingId(userId);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          role: newRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId ? data.user : user
        )
      );

      setMessage(data.message || "Rôle modifié avec succès.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de modifier le rôle."
      );
      setMessageType("error");

      const currentUser = users.find((user) => user.id === userId);

      if (currentUser) {
        setSelectedRoles((previous) => ({
          ...previous,
          [userId]: currentUser.role,
        }));
      }
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Liste des utilisateurs
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {users.length} utilisateur(s) enregistré(s)
          </p>
        </div>
      </div>

      {message && (
        <div
          role="status"
          className={`mx-5 mt-5 rounded-lg p-3 text-sm ${
            messageType === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-5 py-4 font-semibold">Nom</th>
              <th className="px-5 py-4 font-semibold">Email</th>
              <th className="px-5 py-4 font-semibold">Rôle actuel</th>
              <th className="px-5 py-4 font-semibold">Nouveau rôle</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-medium text-slate-900">
                  {user.name}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {user.email}
                </td>

                <td className="px-5 py-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <select
                    value={selectedRoles[user.id]}
                    onChange={(event) =>
                      setSelectedRoles((previous) => ({
                        ...previous,
                        [user.id]: event.target.value as UserRole,
                      }))
                    }
                    disabled={savingId === user.id}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-5 py-4">
                  <button
                    onClick={() => handleRoleChange(user.id)}
                    disabled={
                      savingId === user.id ||
                      selectedRoles[user.id] === user.role
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {savingId === user.id ? "En cours..." : "Modifier"}
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
