import { AddComment } from "../application/use-cases/add-comment";
import { AssignReport } from "../application/use-cases/assign-report";
﻿import { ChangeReportStatus } from "../application/use-cases/change-report-status";
import { ListComments } from "../application/use-cases/list-comments";
import { ListManagers } from "../application/use-cases/list-managers";
import { ListReportHistory } from "../application/use-cases/list-report-history";
import { SupportReport } from "../application/use-cases/support-report";
import { PrismaReportRepository } from "./prisma-report-repository";

const reportRepository = new PrismaReportRepository();

export const reportsContainer = {
  addComment: new AddComment(reportRepository),
  assignReport: new AssignReport(reportRepository),
  changeReportStatus: new ChangeReportStatus(reportRepository),
  listComments: new ListComments(reportRepository),
  listManagers: new ListManagers(reportRepository),
  listReportHistory: new ListReportHistory(reportRepository),
  supportReport: new SupportReport(reportRepository),
};