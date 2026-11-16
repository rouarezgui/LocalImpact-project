import { NextResponse } from "next/server";
import { ReportError } from "../domain/report-error";

export function reportErrorResponse(error: unknown): NextResponse {
  if (error instanceof ReportError) {
    const status =
      error.code === "REPORT_NOT_FOUND"
        ? 404
        : error.code === "ALREADY_SUPPORTED"
          ? 409
          : error.code === "FORBIDDEN"
            ? 403
            : 400;

    return NextResponse.json({ message: error.message }, { status });
  }

  console.error("Erreur interne liée aux signalements :", error);

  return NextResponse.json(
    { message: "Une erreur interne est survenue." },
    { status: 500 }
  );
}
