import type { ReportStatus } from "./report";

const allowedTransitions: Record<ReportStatus, ReportStatus[]> = {
  PENDING: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: [],
  REJECTED: [],
};

export function canChangeReportStatus(
  currentStatus: ReportStatus,
  newStatus: ReportStatus
): boolean {
  return allowedTransitions[currentStatus].includes(newStatus);
}
