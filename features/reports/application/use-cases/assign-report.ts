import type { ReportRepository } from "../ports/report-repository";
import type { ActorRole } from "../../domain/report";
import { ReportError } from "../../domain/report-error";

export interface AssignReportInput {
  reportId: string;
  managerId: string;
  adminId: string;
  userRole: ActorRole;
}

export class AssignReport {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(input: AssignReportInput): Promise<void> {
    if (input.userRole !== "ADMIN") {
      throw new ReportError(
        "FORBIDDEN",
        "Seul un administrateur peut affecter un signalement."
      );
    }

    const report = await this.reportRepository.findById(input.reportId);

    if (!report) {
      throw new ReportError(
        "REPORT_NOT_FOUND",
        "Le signalement demandé est introuvable."
      );
    }

    const manager = await this.reportRepository.findUserById(input.managerId);

    if (!manager) {
      throw new ReportError(
        "ASSIGNEE_NOT_FOUND",
        "Le responsable sélectionné est introuvable."
      );
    }

    if (manager.role !== "MANAGER") {
      throw new ReportError(
        "INVALID_ASSIGNEE",
        "Le signalement ne peut être affecté qu'à un responsable."
      );
    }

    await this.reportRepository.assignReport({
      reportId: report.id,
      managerId: manager.id,
      managerName: manager.name,
      currentStatus: report.status,
      adminId: input.adminId,
    });
  }
}
