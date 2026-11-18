import type { ReportRepository } from "../ports/report-repository";
import type { ReportComment } from "../../domain/report";
import { ReportError } from "../../domain/report-error";
import { MAX_COMMENT_LENGTH } from "../../domain/report-rules";

export interface AddCommentInput {
  reportId: string;
  userId: string;
  content: string;
}

export class AddComment {
  constructor(private readonly reportRepository: ReportRepository) {}

  async execute(input: AddCommentInput): Promise<ReportComment> {
    const report = await this.reportRepository.findById(input.reportId);

    if (!report) {
      throw new ReportError(
        "REPORT_NOT_FOUND",
        "Le signalement demandé est introuvable."
      );
    }

    const content = input.content.trim();

    if (!content) {
      throw new ReportError(
        "COMMENT_EMPTY",
        "Le commentaire ne peut pas être vide."
      );
    }

    if (content.length > MAX_COMMENT_LENGTH) {
      throw new ReportError(
        "COMMENT_TOO_LONG",
        `Le commentaire ne peut pas dépasser ${MAX_COMMENT_LENGTH} caractères.`
      );
    }

    return this.reportRepository.addComment(
      input.reportId,
      input.userId,
      content
    );
  }
}
