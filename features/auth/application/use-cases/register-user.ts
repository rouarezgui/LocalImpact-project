import { AuthError } from "../../domain/auth-error";
import type { AuthUser } from "../../domain/user";
import type { UserRepository } from "../ports/user-repository";
import type { PasswordHasher } from "../ports/password-hasher";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<AuthUser> {
    const email = input.email.trim().toLowerCase();

    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new AuthError(
        "EMAIL_ALREADY_EXISTS",
        "Cette adresse e-mail est déjà utilisée."
      );
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    return this.users.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });
  }
}
