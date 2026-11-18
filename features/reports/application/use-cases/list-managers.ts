import type { ReportRepository } from "../ports/report-repository";
import type { ActorRole, UserSummary } from "../../domain/report";
import { ReportError } from "../../domain/report-error";

export class ListManagers {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(userRole: ActorRole): Promise<UserSummary[]> {
    if (userRole !== "ADMIN") {
      throw new ReportError(
        "FORBIDDEN",
        "Seul un administrateur peut consulter la liste des responsables."
      );
    }

    return this.reportRepository.listManagers();
  }
}
