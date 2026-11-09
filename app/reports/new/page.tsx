import { Suspense } from "react";
import { requireUser } from "@/lib/auth/dal";
import ReportForm from "./report-form";

async function ProtectedReportForm() {
  await requireUser();
  return <ReportForm />;
}

export default function NewReportPage() {
  return (
    <Suspense fallback={<div>Chargement du formulaire...</div>}>
      <ProtectedReportForm />
    </Suspense>
  );
}
