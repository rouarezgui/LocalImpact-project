import type { AuthUser } from "../../domain/user";
import type { UserRepository } from "../ports/user-repository";

export class ListUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<AuthUser[]> {
    return this.userRepository.findAll();
  }
}
