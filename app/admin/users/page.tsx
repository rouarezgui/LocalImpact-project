
import { requirePermission } from "@/lib/auth/authorization";
import { authContainer } from "@/features/auth/infrastructure/auth-container";
import AdminUsersClient from "./admin-users-client";

export const instant = false;

export default async function AdminUsersPage() {
  await requirePermission("USER_VIEW");

  const users = await authContainer.listUsers.execute();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Gestion des utilisateurs
          </h1>

          <p className="mt-2 text-slate-600">
            Consultez les utilisateurs et gérez leurs rôles.
          </p>
        </div>

        <AdminUsersClient initialUsers={users} />
      </div>
    </main>
  );
}
