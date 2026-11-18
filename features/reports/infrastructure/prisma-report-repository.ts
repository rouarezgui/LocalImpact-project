import { prisma } from "@/lib/prisma";
import type { ReportRepository } from "../application/ports/report-repository";
import { ReportError } from "../domain/report-error";
import type {
  Report,
  ReportAssignment,
  ReportComment,
  ReportHistoryEntry,
  ReportStatusChange,
  UserSummary,
} from "../domain/report";

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
        data: {
          status: change.newStatus,
          ...(change.newStatus === "RESOLVED"
            ? { resolutionDescription: change.description }
            : {}),
        },
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

  async hasUserSupported(reportId: string, userId: string): Promise<boolean> {
    const support = await prisma.support.findUnique({
      where: { userId_reportId: { userId, reportId } },
    });
    return support !== null;
  }

  async addSupport(reportId: string, userId: string): Promise<void> {
    try {
      await prisma.support.create({ data: { reportId, userId } });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new ReportError(
          "ALREADY_SUPPORTED",
          "Vous avez déjà soutenu ce signalement."
        );
      }

      throw error;
    }
  }

  async countSupports(reportId: string): Promise<number> {
    return prisma.support.count({ where: { reportId } });
  }

  async listComments(reportId: string): Promise<ReportComment[]> {
    const comments = await prisma.comment.findMany({
      where: { reportId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { name: true } } },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      authorName: comment.user.name,
    }));
  }

  async addComment(
    reportId: string,
    userId: string,
    content: string
  ): Promise<ReportComment> {
    const comment = await prisma.comment.create({
      data: { reportId, userId, content },
      include: { user: { select: { name: true } } },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      authorName: comment.user.name,
    };
  }

  async listHistory(reportId: string): Promise<ReportHistoryEntry[]> {
    const history = await prisma.reportHistory.findMany({
      where: { reportId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { name: true } } },
    });

    return history.map((entry) => ({
      id: entry.id,
      oldStatus: entry.oldStatus,
      newStatus: entry.newStatus,
      description: entry.description,
      createdAt: entry.createdAt.toISOString(),
      authorName: entry.user.name,
    }));
  }

  async findUserById(userId: string): Promise<UserSummary | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true },
    });
  }

  async listManagers(): Promise<UserSummary[]> {
    return prisma.user.findMany({
      where: { role: "MANAGER" },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: { id: true, name: true, role: true },
    });
  }

  async assignReport(assignment: ReportAssignment): Promise<void> {
    await prisma.$transaction([
      prisma.report.update({
        where: { id: assignment.reportId },
        data: { assignedToId: assignment.managerId },
      }),
      prisma.reportHistory.create({
        data: {
          reportId: assignment.reportId,
          oldStatus: assignment.currentStatus,
          newStatus: assignment.currentStatus,
          description: `Signalement affecté à ${assignment.managerName}`,
          userId: assignment.adminId,
        },
      }),
    ]);
  }
}
