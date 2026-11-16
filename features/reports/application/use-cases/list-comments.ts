import type { ReportRepository } from "../ports/report-repository";
import type { ReportComment } from "../../domain/report";
import { ReportError } from "../../domain/report-error";

export interface ListCommentsInput {
  reportId: string;
}

export class ListComments {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(input: ListCommentsInput): Promise<ReportComment[]> {
    const report = await this.reportRepository.findById(input.reportId);

    if (!report) {
      throw new ReportError(
        "REPORT_NOT_FOUND",
        "Le signalement demandé est introuvable."
      );
    }

    return this.reportRepository.listComments(input.reportId);
  }
}
