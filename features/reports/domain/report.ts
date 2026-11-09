export type ReportStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export interface Report {
  id: string;
  status: ReportStatus;
  creatorId: string;
  assignedToId: string | null;
}

export interface ReportStatusChange {
  reportId: string;
  oldStatus: ReportStatus;
  newStatus: ReportStatus;
  description: string | null;
  userId: string;
}
