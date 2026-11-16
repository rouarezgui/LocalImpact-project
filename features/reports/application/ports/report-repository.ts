import type {
  Report,
  ReportAssignment,
  ReportComment,
  ReportHistoryEntry,
  ReportStatusChange,
  UserSummary,
} from "../../domain/report";

export interface ReportRepository {
  findById(id: string): Promise<Report | null>;

  updateStatusAndCreateHistory(
    change: ReportStatusChange
  ): Promise<void>;

  hasUserSupported(reportId: string, userId: string): Promise<boolean>;
  addSupport(reportId: string, userId: string): Promise<void>;
  countSupports(reportId: string): Promise<number>;
  listComments(reportId: string): Promise<ReportComment[]>;
  addComment(
    reportId: string,
    userId: string,
    content: string
  ): Promise<ReportComment>;
  listHistory(reportId: string): Promise<ReportHistoryEntry[]>;
  findUserById(userId: string): Promise<UserSummary | null>;
  listManagers(): Promise<UserSummary[]>;
  assignReport(assignment: ReportAssignment): Promise<void>;
}
