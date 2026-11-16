export type ReportStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export type ActorRole = "USER" | "MANAGER" | "ADMIN";

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

export interface ReportComment {
  id: string;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface ReportHistoryEntry {
  id: string;
  oldStatus: ReportStatus | null;
  newStatus: ReportStatus;
  description: string | null;
  createdAt: string;
  authorName: string;
}

export interface UserSummary {
  id: string;
  name: string;
  role: ActorRole;
}

export interface ReportAssignment {
  reportId: string;
  managerId: string;
  managerName: string;
  currentStatus: ReportStatus;
  adminId: string;
}
