import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/dal";
import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { ReportError } from "@/features/reports/domain/report-error";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    // 1. Connecté ?
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    // 2. Exécuter l'action métier
    const { id } = await context.params;
    const result = await reportsContainer.supportReport.execute({
      reportId: id,
      userId: currentUser.id,
    });

    return NextResponse.json(
      { message: "Merci pour votre soutien.", supportCount: result.supportCount },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ReportError) {
      const status =
        error.code === "REPORT_NOT_FOUND" ? 404 :
        error.code === "ALREADY_SUPPORTED" ? 409 : 400;
      return NextResponse.json({ message: error.message }, { status });
    }

    console.error("Erreur lors du soutien :", error);
    return NextResponse.json(
      { message: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}