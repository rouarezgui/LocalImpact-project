import type { Report, ReportStatusChange } from "../../domain/report";

export interface ReportRepository {
  findById(id: string): Promise<Report | null>;

  updateStatusAndCreateHistory(
    change: ReportStatusChange
  ): Promise<void>;

  hasUserSupported(reportId: string, userId: string): Promise<boolean>;
  addSupport(reportId: string, userId: string): Promise<void>;
  countSupports(reportId: string): Promise<number>;
}
