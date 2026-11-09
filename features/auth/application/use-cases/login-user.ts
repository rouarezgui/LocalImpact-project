import { AuthError } from "../../domain/auth-error";
import type { AuthUser } from "../../domain/user";
import type { UserRepository } from "../ports/user-repository";
import type { PasswordHasher } from "../ports/password-hasher";
import type { SessionRepository } from "../ports/session-repository";
import type { SessionTokenGenerator } from "../ports/session-token-generator";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  user: AuthUser;
  sessionToken: string;
  expiresAt: Date;
}

export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly sessions: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: SessionTokenGenerator
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const email = input.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new AuthError(
        "INVALID_CREDENTIALS",
        "Email ou mot de passe incorrect."
      );
    }

    const passwordIsValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash
    );

    if (!passwordIsValid) {
      throw new AuthError(
        "INVALID_CREDENTIALS",
        "Email ou mot de passe incorrect."
      );
    }

    const sessionToken = this.tokenGenerator.generate();
    const tokenHash = this.tokenGenerator.hash(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await this.sessions.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    const { passwordHash: _passwordHash, ...authUser } = user;

    return {
      user: authUser,
      sessionToken,
      expiresAt,
    };
  }
}
