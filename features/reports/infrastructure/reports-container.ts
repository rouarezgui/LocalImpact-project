import { ChangeReportStatus } from "../application/use-cases/change-report-status";
import { SupportReport } from "../application/use-cases/support-report";
import { PrismaReportRepository } from "./prisma-report-repository";

const reportRepository = new PrismaReportRepository();

export const reportsContainer = {
  changeReportStatus: new ChangeReportStatus(reportRepository),
  supportReport: new SupportReport(reportRepository),
};