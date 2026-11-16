export type ReportErrorCode =
  | "REPORT_NOT_FOUND"
  | "INVALID_STATUS_TRANSITION"
  | "ALREADY_SUPPORTED"
  | "COMMENT_EMPTY"
  | "COMMENT_TOO_LONG"
  | "RESOLUTION_DESCRIPTION_REQUIRED"
  | "FORBIDDEN"
  | "ASSIGNEE_NOT_FOUND"
  | "INVALID_ASSIGNEE";

export class ReportError extends Error {
  constructor(
    public readonly code: ReportErrorCode,
    message: string
  ) {
    super(message);
    this.name = "ReportError";
  }
}
