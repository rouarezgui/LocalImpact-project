import "server-only";

import { redirect } from "next/navigation";

import { getCurrentUser } from "./dal";
import {
  hasPermission,
  type Permission,
} from "@/features/auth/domain/permissions";

export async function requirePermission(
  permission: Permission
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!hasPermission(user.role, permission)) {
    redirect("/unauthorized");
  }

  return user;
}
