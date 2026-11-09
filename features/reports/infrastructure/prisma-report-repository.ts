import { prisma } from "@/lib/prisma";
import type { ReportRepository } from "../application/ports/report-repository";
import type { Report, ReportStatusChange } from "../domain/report";

export class PrismaReportRepository implements ReportRepository {
  async findById(id: string): Promise<Report | null> {
    const report = await prisma.report.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        creatorId: true,
        assignedToId: true,
      },
    });

    if (!report) return null;

    return {
      id: report.id,
      status: report.status,
      creatorId: report.creatorId,
      assignedToId: report.assignedToId,
    };
  }

  async updateStatusAndCreateHistory(
    change: ReportStatusChange
  ): Promise<void> {
    await prisma.$transaction([
      prisma.report.update({
        where: { id: change.reportId },
        data: { status: change.newStatus },
      }),
      prisma.reportHistory.create({
        data: {
          reportId: change.reportId,
          oldStatus: change.oldStatus,
          newStatus: change.newStatus,
          description: change.description,
          userId: change.userId,
        },
      }),
    ]);
  }
}
