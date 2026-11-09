import { prisma } from "@/lib/prisma";
import type {
  CreateSessionData,
  SessionRecord,
  SessionRepository,
} from "../application/ports/session-repository";

export class PrismaSessionRepository implements SessionRepository {
  async create(data: CreateSessionData): Promise<SessionRecord> {
    return prisma.session.create({
      data,
      select: {
        id: true,
        tokenHash: true,
        userId: true,
        expiresAt: true,
      },
    });
  }

  async findByTokenHash(tokenHash: string): Promise<SessionRecord | null> {
    return prisma.session.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        tokenHash: true,
        userId: true,
        expiresAt: true,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { id },
    });
  }

  async deleteExpired(now: Date): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: { lte: now },
      },
    });

    return result.count;
  }
}
