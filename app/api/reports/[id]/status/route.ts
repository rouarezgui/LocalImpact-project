import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/dal";
import { reportsContainer } from "@/features/reports/infrastructure/reports-container";
import { ReportError } from "@/features/reports/domain/report-error";

const statusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]),
  description: z.string().trim().max(1000).nullable().optional(),
});

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // 1. Vérifier l'authentification
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Vous devez être connecté." },
        { status: 401 }
      );
    }

    // 2. Vérifier les permissions RBAC
    if (!["MANAGER", "ADMIN"].includes(currentUser.role)) {
      return NextResponse.json(
        { message: "Vous n'avez pas les permissions nécessaires." },
        { status: 403 }
      );
    }

    // 3. Récupérer et valider les données
    const { id } = await context.params;
    const body = await request.json();
    const validation = statusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Données invalides.", errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    // 4. Exécuter le changement de statut
    await reportsContainer.changeReportStatus.execute({
      reportId: id,
      newStatus: validation.data.status,
      description: validation.data.description ?? null,
      userId: currentUser.id,
    });

    return NextResponse.json({
      message: "Le statut du signalement a été mis à jour.",
    });
  } catch (error) {
    if (error instanceof ReportError) {
      const status =
        error.code === "REPORT_NOT_FOUND" ? 404 : 400;

      return NextResponse.json(
        { message: error.message },
        { status }
      );
    }

    console.error("Erreur lors du changement de statut :", error);

    return NextResponse.json(
      { message: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
