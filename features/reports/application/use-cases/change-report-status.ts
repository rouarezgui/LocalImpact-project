import type { ReportRepository } from "../ports/report-repository";
import type { ReportStatus } from "../../domain/report";
import { canChangeReportStatus } from "../../domain/report-rules";
import { ReportError } from "../../domain/report-error";

export interface ChangeReportStatusInput {
  reportId: string;
  newStatus: ReportStatus;
  description: string | null;
  userId: string;
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

    if (!canChangeReportStatus(report.status, input.newStatus)) {
      throw new ReportError(
        "INVALID_STATUS_TRANSITION",
        "Cette transition de statut n'est pas autorisée."
      );
    }

    await this.reportRepository.updateStatusAndCreateHistory({
      reportId: report.id,
      oldStatus: report.status,
      newStatus: input.newStatus,
      description: input.description,
      userId: input.userId,
    });
  }
}
