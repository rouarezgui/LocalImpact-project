import type { ReportRepository } from "../ports/report-repository";
import { ReportError } from "../../domain/report-error";

export interface SupportReportInput {
  reportId: string;
  userId: string;
}

export class SupportReport {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(input: SupportReportInput): Promise<{ supportCount: number }> {
    // 1. Le signalement existe ?
    const report = await this.reportRepository.findById(input.reportId);
    if (!report) {
      throw new ReportError(
        "REPORT_NOT_FOUND",
        "Le signalement demandé est introuvable."
      );
    }

    // 2. Cet utilisateur l'a déjà soutenu ?
    const alreadySupported = await this.reportRepository.hasUserSupported(
      input.reportId,
      input.userId
    );
    if (alreadySupported) {
      throw new ReportError(
        "ALREADY_SUPPORTED",
        "Vous avez déjà soutenu ce signalement."
      );
    }

    // 3. On enregistre le soutien, puis on renvoie le nouveau total
    await this.reportRepository.addSupport(input.reportId, input.userId);
    const supportCount = await this.reportRepository.countSupports(input.reportId);

    return { supportCount };
  }
}