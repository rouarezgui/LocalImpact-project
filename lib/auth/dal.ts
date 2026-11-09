import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authContainer } from "@/features/auth/infrastructure/auth-container";
import { AuthError } from "@/features/auth/domain/auth-error";
import type { AuthUser } from "@/features/auth/domain/user";
import { SESSION_COOKIE_NAME } from "./session";
import type { UserRole } from "@/features/auth/domain/user";

export const getCurrentUser = cache(
  async (): Promise<AuthUser | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    try {
      return await authContainer.verifySession.execute(token);
    } catch (error) {
      if (error instanceof AuthError) {
        return null;
      }

      throw error;
    }
  }
);

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(
  allowedRoles: UserRole[]
): Promise<AuthUser> {
  const user = await requireUser();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}