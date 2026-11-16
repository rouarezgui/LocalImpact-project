export type ReportErrorCode =
  | "REPORT_NOT_FOUND"
  | "INVALID_STATUS_TRANSITION"
  | "ALREADY_SUPPORTED";

export class ReportError extends Error {
  constructor(
    public readonly code: ReportErrorCode,
    message: string
  ) {
    super(message);
    this.name = "ReportError";
  }
}
