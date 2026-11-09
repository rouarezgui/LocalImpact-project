import { prisma } from "@/lib/prisma";
import type { AuthUser, UserCredentials, UserRole  } from "../domain/user";
import type {
  CreateUserData,
  UserRepository,
} from "../application/ports/user-repository";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserCredentials | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.password,
    };
  }

  async findById(id: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  async create(data: CreateUserData): Promise<AuthUser> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  async findAll(): Promise<AuthUser[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

async countAdmins(): Promise<number> {
  return prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });
}

async updateRole(
  id: string,
  role: UserRole
): Promise<AuthUser> {
  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
}
}
