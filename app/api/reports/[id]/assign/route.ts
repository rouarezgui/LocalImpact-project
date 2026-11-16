import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { reportErrorResponse } from "@/features/reports/presentation/report-error-response";
import { getCurrentUser } from "@/lib/auth/dal";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const assignmentSchema = z.object({
  managerId: z.string().trim().min(1),
});

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Format JSON invalide." },
        { status: 400 }
      );
    }

    const validation = assignmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Un responsable valide doit être sélectionné." },
        { status: 400 }
      );
    }

    const { id } = await context.params;
    await reportsContainer.assignReport.execute({
      reportId: id,
      managerId: validation.data.managerId,
      adminId: currentUser.id,
      userRole: currentUser.role,
    });

    return NextResponse.json({
      message: "Le signalement a été affecté au responsable.",
    });
  } catch (error) {
    return reportErrorResponse(error);
  }
}
