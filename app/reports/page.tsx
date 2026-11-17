import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth/dal";
import Navbar from "../components/Navbar";
import ReportsListClient from "./reports-list-client";

async function ReportsContent() {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen bg-slate-50 px-5 py-12 text-slate-900 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ReportsListClient />
        </div>
      </main>
    </>
  );
}

export default function ReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Chargement des signalements...
        </div>
      }
    >
      <ReportsContent />
    </Suspense>
  );
}
