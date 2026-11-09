import type { AuthUser, UserRole } from "../../domain/user";
import type { UserRepository } from "../ports/user-repository";

export class ChangeUserRole {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    id: string,
    role: UserRole,
    actorId?: string
  ): Promise<AuthUser> {
    if (!id.trim()) {
      throw new Error("User ID is required.");
    }

    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

    if (actorId === id && role !== "ADMIN") {
      throw new Error("SELF_ROLE_CHANGE");
    }

    if (existingUser.role === "ADMIN" && role !== "ADMIN") {
      const adminCount = await this.userRepository.countAdmins();

      if (adminCount <= 1) {
        throw new Error("LAST_ADMIN");
      }
    }

    return this.userRepository.updateRole(id, role);
  }
}