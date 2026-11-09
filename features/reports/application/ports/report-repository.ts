import type { Report, ReportStatusChange } from "../../domain/report";

export interface ReportRepository {
  findById(id: string): Promise<Report | null>;

  updateStatusAndCreateHistory(
    change: ReportStatusChange
  ): Promise<void>;
}
