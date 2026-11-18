import type { ReportRepository } from "../ports/report-repository";
import type { ActorRole, ReportStatus } from "../../domain/report";
import { canChangeReportStatus } from "../../domain/report-rules";
import { ReportError } from "../../domain/report-error";

export interface ChangeReportStatusInput {
  reportId: string;
  newStatus: ReportStatus;
  description: string | null;
  userId: string;
  userRole: ActorRole;
}

export class ChangeReportStatus {
  constructor(
    private readonly reportRepository: ReportRepository
  ) {}

  async execute(input: ChangeReportStatusInput): Promise<void> {
    const report = await this.reportRepository.findById(input.reportId);

    if (!report) {
      throw new ReportError(
        "REPORT_NOT_FOUND",
        "Le signalement demandé est introuvable."
      );
    }

    if (
      input.userRole !== "ADMIN" &&
      (input.userRole !== "MANAGER" || report.assignedToId !== input.userId)
    ) {
      throw new ReportError(
        "FORBIDDEN",
        "Vous n'êtes pas autorisé à modifier ce signalement."
      );
    }

    if (!canChangeReportStatus(report.status, input.newStatus)) {
      throw new ReportError(
        "INVALID_STATUS_TRANSITION",
        "Cette transition de statut n'est pas autorisée."
      );
    }

    const description = input.description?.trim() || null;

    if (input.newStatus === "RESOLVED" && !description) {
      throw new ReportError(
        "RESOLUTION_DESCRIPTION_REQUIRED",
        "Une description de l'intervention est obligatoire pour résoudre un signalement."
      );
    }

    await this.reportRepository.updateStatusAndCreateHistory({
      reportId: report.id,
      oldStatus: report.status,
      newStatus: input.newStatus,
      description,
      userId: input.userId,
    });
  }
}
