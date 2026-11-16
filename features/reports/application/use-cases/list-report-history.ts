import type { ReportRepository } from "../ports/report-repository";
import type { ReportHistoryEntry } from "../../domain/report";
import { ReportError } from "../../domain/report-error";

export interface ListReportHistoryInput {
  reportId: string;
}

export class ListReportHistory {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(
    input: ListReportHistoryInput
  ): Promise<ReportHistoryEntry[]> {
    const report = await this.reportRepository.findById(input.reportId);

    if (!report) {
      throw new ReportError(
        "REPORT_NOT_FOUND",
        "Le signalement demandé est introuvable."
      );
    }

    return this.reportRepository.listHistory(input.reportId);
  }
}
