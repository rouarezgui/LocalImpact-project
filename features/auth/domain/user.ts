export type UserRole = "USER" | "MANAGER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserCredentials extends AuthUser {
  passwordHash: string;
}
