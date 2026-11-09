import type { AuthUser, UserCredentials, UserRole } from "../../domain/user";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserCredentials | null>;
  findById(id: string): Promise<AuthUser | null>;
  findAll(): Promise<AuthUser[]>;
  countAdmins(): Promise<number>;
  create(data: CreateUserData): Promise<AuthUser>;
  updateRole(id: string, role: UserRole): Promise<AuthUser>;
}