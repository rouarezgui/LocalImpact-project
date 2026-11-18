import { NextRequest, NextResponse } from "next/server";

import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { reportErrorResponse } from "@/features/reports/presentation/report-error-response";
import { getCurrentUser } from "@/lib/auth/dal";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const history = await reportsContainer.listReportHistory.execute({
      reportId: id,
    });

    return NextResponse.json(history);
  } catch (error) {
    return reportErrorResponse(error);
  }
}
