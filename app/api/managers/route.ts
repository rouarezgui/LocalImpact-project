import { NextResponse } from "next/server";

import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { reportErrorResponse } from "@/features/reports/presentation/report-error-response";
import { getCurrentUser } from "@/lib/auth/dal";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    const managers = await reportsContainer.listManagers.execute(
      currentUser.role
    );

    return NextResponse.json(managers);
  } catch (error) {
    return reportErrorResponse(error);
  }
}
