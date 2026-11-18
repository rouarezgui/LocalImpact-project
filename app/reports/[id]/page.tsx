import { Suspense } from "react";
import { requireUser } from "@/lib/auth/dal";
import ReportDetailsClient from "./report-details-client";

async function ProtectedReportDetails() {
  const currentUser = await requireUser();
  return <ReportDetailsClient currentUser={currentUser} />;
}

export default function ReportDetailsPage() {
  return (
    <Suspense fallback={<div>Chargement du signalement...</div>}>
      <ProtectedReportDetails />
    </Suspense>
  );
}
