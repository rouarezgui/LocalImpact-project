import { Suspense } from "react";
import { requireUser } from "@/lib/auth/dal";
import ReportDetailsClient from "./report-details-client";

async function ProtectedReportDetails() {
  await requireUser();
  return <ReportDetailsClient />;
}

export default function ReportDetailsPage() {
  return (
    <Suspense fallback={<div>Chargement du signalement...</div>}>
      <ProtectedReportDetails />
    </Suspense>
  );
}
