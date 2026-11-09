import type { UserRole } from "./user";

export type Permission =
  | "REPORT_CREATE"
  | "REPORT_VIEW"
  | "REPORT_COMMENT"
  | "REPORT_SUPPORT"
  | "REPORT_MANAGE"
  | "USER_VIEW"
  | "USER_MANAGE"
  | "ROLE_MANAGE";

const rolePermissions: Record<UserRole, Permission[]> = {
  USER: [
    "REPORT_CREATE",
    "REPORT_VIEW",
    "REPORT_COMMENT",
    "REPORT_SUPPORT",
  ],

  MANAGER: [
    "REPORT_CREATE",
    "REPORT_VIEW",
    "REPORT_COMMENT",
    "REPORT_SUPPORT",
    "REPORT_MANAGE",
  ],

  ADMIN: [
    "REPORT_CREATE",
    "REPORT_VIEW",
    "REPORT_COMMENT",
    "REPORT_SUPPORT",
    "REPORT_MANAGE",
    "USER_VIEW",
    "USER_MANAGE",
    "ROLE_MANAGE",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return rolePermissions[role].includes(permission);
}

export function getPermissionsForRole(
  role: UserRole
): readonly Permission[] {
  return rolePermissions[role];
}
