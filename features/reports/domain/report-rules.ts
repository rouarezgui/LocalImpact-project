import type { ReportStatus } from "./report";

const allowedTransitions: Record<ReportStatus, ReportStatus[]> = {
  PENDING: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: [],
  REJECTED: [],
};

export const MAX_COMMENT_LENGTH = 500;

export function canChangeReportStatus(
  currentStatus: ReportStatus,
  newStatus: ReportStatus
): boolean {
  return allowedTransitions[currentStatus].includes(newStatus);
}

export function getAllowedNextStatuses(
  status: ReportStatus
): ReportStatus[] {
  return [...allowedTransitions[status]];
}
