import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/dal";
import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { reportErrorResponse } from "@/features/reports/presentation/report-error-response";

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
    return reportErrorResponse(error);
  }
}